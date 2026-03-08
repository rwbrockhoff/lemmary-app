import { useState, useRef, useEffect } from 'react';
import { Text, TextField } from '@artifact-ui/core';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useBomSuggestions } from '../../api/bom-queries';
import type { BomSuggestion } from '@/types/api';
import styles from './bom-piece-input.module.css';

type BomPieceInputProps = {
	value: string;
	onChange: (value: string) => void;
	onSelect: (suggestion: BomSuggestion) => void;
};

export const BomPieceInput = ({
	value,
	onChange,
	onSelect,
}: BomPieceInputProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const debouncedValue = useDebouncedValue(value, 300);
	const { data: suggestions } = useBomSuggestions(debouncedValue);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (suggestion: BomSuggestion) => {
		onChange(suggestion.piece);
		onSelect(suggestion);
		setIsOpen(false);
	};

	const showSuggestions =
		isOpen && suggestions && suggestions.length > 0 && value.length >= 2;

	return (
		<div ref={containerRef} className={styles.container}>
			<Text
				size="1"
				weight="medium"
				color="secondary"
				className="mb-1"
			>
				Piece
			</Text>
			<TextField.Standalone
				label="Piece"
				value={value}
				onChange={(e) => {
					onChange(e.target.value);
					setIsOpen(true);
				}}
				onFocus={() => setIsOpen(true)}
				autoComplete="off"
			/>
			{showSuggestions && (
				<ul className={styles.dropdown}>
					{suggestions.map((s, i) => (
						<li key={`${s.piece}-${s.material_id}-${i}`}>
							<button
								type="button"
								className={styles.option}
								onClick={() => handleSelect(s)}
							>
								<span className={styles.pieceName}>
									{s.piece}
								</span>
								<span className={styles.typeName}>
									{s.material_type_name}
								</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
