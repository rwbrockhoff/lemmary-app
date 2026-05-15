import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { TextField } from '@artifact-ui/core';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useSearchMaterialCatalog } from '../../api/bom-queries';
import type { MaterialCatalogEntry } from '@/types/api';
import styles from './type-input.module.css';

type TypeInputProps = {
	value: string;
	measurement: string;
	onChange: (value: string) => void;
	onSelect: (entry: MaterialCatalogEntry) => void;
	onAutoMatch?: (materialTypeId: string | null) => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	autoFocus?: boolean;
};

export const TypeInput = ({
	value,
	measurement,
	onChange,
	onSelect,
	onAutoMatch,
	onKeyDown,
	autoFocus,
}: TypeInputProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
	const containerRef = useRef<HTMLDivElement>(null);
	const debouncedValue = useDebouncedValue(value, 200);
	const { data: results } = useSearchMaterialCatalog(debouncedValue, measurement);

	const onAutoMatchRef = useRef(onAutoMatch);
	useEffect(() => {
		onAutoMatchRef.current = onAutoMatch;
	});

	useEffect(() => {
		const trimmed = value.trim().toLowerCase();
		if (!trimmed) {
			onAutoMatchRef.current?.(null);
			return;
		}
		const match = results?.find(
			(r) => r.material_type_name.trim().toLowerCase() === trimmed,
		);
		onAutoMatchRef.current?.(match?.material_type_id ?? null);
	}, [value, results]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useLayoutEffect(() => {
		if (!isOpen || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		setPosition({
			top: rect.bottom + 4,
			left: rect.left,
			width: Math.max(rect.width, 180),
		});
	}, [isOpen, value]);

	const handleSelect = (entry: MaterialCatalogEntry) => {
		onChange(entry.material_type_name);
		onSelect(entry);
		setIsOpen(false);
	};

	const getLabel = (entry: MaterialCatalogEntry) => {
		const detail = entry.color || entry.size;
		if (!detail) return entry.material_type_name;
		return `${entry.material_type_name} - ${detail}`;
	};

	const showResults = isOpen && results && results.length > 0 && value.length >= 1;

	return (
		<div ref={containerRef}>
			<TextField.Standalone
				label="Type"
				variant="minimal"
				size="1"
				compact
				override
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
					setIsOpen(true);
				}}
				onFocus={() => setIsOpen(true)}
				onKeyDown={onKeyDown}
				autoComplete="off"
				placeholder="Type"
				autoFocus={autoFocus}
			/>
			{showResults &&
				createPortal(
					<ul
						className={styles.dropdown}
						style={{
							position: 'fixed',
							top: position.top,
							left: position.left,
							width: Math.max(position.width, 220),
						}}>
						{results.map((entry, i) => (
							<li key={`${entry.material_type_id}-${entry.color}-${entry.size}-${i}`}>
								<button
									type="button"
									className={styles.option}
									onMouseDown={(e) => {
										e.preventDefault();
										handleSelect(entry);
									}}>
									{getLabel(entry)}
								</button>
							</li>
						))}
					</ul>,
					document.body,
				)}
		</div>
	);
};
