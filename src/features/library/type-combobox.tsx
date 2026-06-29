import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { TextField } from '@artifact-ui/core';
import { useMaterialTypes } from '@/features/storefront/api/bom-queries';
import type { BomMaterialType } from '@/types/api';
import styles from './type-combobox.module.css';

type TypeComboboxProps = {
	value: string;
	onChange: (value: string) => void;
	onSelectType: (type: BomMaterialType) => void;
	onMatch: (type: BomMaterialType | null) => void;
	autoFocus?: boolean;
};

export const TypeCombobox = ({
	value,
	onChange,
	onSelectType,
	onMatch,
	autoFocus,
}: TypeComboboxProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
	const containerRef = useRef<HTMLDivElement>(null);
	const { data: types } = useMaterialTypes();

	const trimmed = value.trim().toLowerCase();
	const matches = (types ?? []).filter((t) => t.name.toLowerCase().includes(trimmed));

	const onMatchRef = useRef(onMatch);
	useEffect(() => {
		onMatchRef.current = onMatch;
	});

	useEffect(() => {
		if (!trimmed) {
			onMatchRef.current(null);
			return;
		}
		const exact = (types ?? []).find((t) => t.name.trim().toLowerCase() === trimmed);
		onMatchRef.current(exact ?? null);
	}, [trimmed, types]);

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

	const handleSelect = (type: BomMaterialType) => {
		onChange(type.name);
		onSelectType(type);
		setIsOpen(false);
	};

	const showResults = isOpen && matches.length > 0 && value.length >= 1;

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
						{matches.map((type) => (
							<li key={type.id}>
								<button
									type="button"
									className={styles.option}
									onMouseDown={(e) => {
										e.preventDefault();
										handleSelect(type);
									}}>
									{type.name}
								</button>
							</li>
						))}
					</ul>,
					document.body,
				)}
		</div>
	);
};
