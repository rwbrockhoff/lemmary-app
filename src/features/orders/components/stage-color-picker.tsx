import type { CSSProperties } from 'react';
import { DropdownMenu, Flex, cn } from '@artifact-ui/core';
import {
	WORKFLOW_STAGE_COLORS,
	type WorkflowStageColor,
} from '../constants/stage-colors';
import styles from './stage-color-picker.module.css';

type StageColorPickerProps = {
	value: WorkflowStageColor;
	onChange: (color: WorkflowStageColor) => void;
};

const swatchStyle = (color: WorkflowStageColor): CSSProperties =>
	({ '--swatch-bg': `var(--wf-stage-color-${color})` }) as CSSProperties;

export const StageColorPicker = ({ value, onChange }: StageColorPickerProps) => {
	return (
		<DropdownMenu.DropdownMenu>
			<DropdownMenu.DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label="Pick a color"
					className={styles.swatch}
					style={swatchStyle(value)}
				/>
			</DropdownMenu.DropdownMenuTrigger>

			<DropdownMenu.DropdownMenuContent side="top" align="start" compact>
				<Flex gap="2" className="p-2">
					{WORKFLOW_STAGE_COLORS.map((color) => {
						const isSelected = value === color;
						return (
							<DropdownMenu.DropdownMenuItem key={color} asChild>
								<button
									type="button"
									aria-label={`Set color ${color}`}
									aria-pressed={isSelected}
									onClick={() => onChange(color)}
									className={cn(
										styles.swatch,
										isSelected && styles.swatchSelected,
									)}
									style={swatchStyle(color)}
								/>
							</DropdownMenu.DropdownMenuItem>
						);
					})}
				</Flex>
			</DropdownMenu.DropdownMenuContent>
		</DropdownMenu.DropdownMenu>
	);
};
