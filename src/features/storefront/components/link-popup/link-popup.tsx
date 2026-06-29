import { useState } from 'react';
import { Flex, Button, IconButton, TextField, Popover, cn } from '@artifact-ui/core';
import {
	LinkIcon,
	SaveIcon,
	TrashIcon,
	ExternalLinkIcon,
} from '@/components/icons/icons';
import styles from './link-popup.module.css';

type LinkPopupProps = {
	url: string;
	onSave: (url: string) => void;
};

export const LinkPopup = ({ url, onSave }: LinkPopupProps) => {
	const [value, setValue] = useState(url);
	const [open, setOpen] = useState(false);

	const hasUrl = url.trim().length > 0;

	const getFullUrl = (raw: string) => {
		if (/^https?:\/\//.test(raw)) return raw;
		return `https://${raw}`;
	};

	const handleOpenChange = (isOpen: boolean) => {
		if (isOpen) setValue(url);
		setOpen(isOpen);
	};

	const handleSave = () => {
		onSave(value.trim());
	};

	const handleDelete = () => {
		setValue('');
		onSave('');
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSave();
		}
	};

	return (
		<Popover.Root open={open} onOpenChange={handleOpenChange}>
			<Popover.Trigger asChild>
				<button
					type="button"
					className={cn(styles.trigger, hasUrl && styles.triggerActive)}
					onClick={(e) => e.stopPropagation()}>
					<LinkIcon size={14} strokeWidth={hasUrl ? 3 : 2} />
				</button>
			</Popover.Trigger>
			<Popover.Content side="top" align="end" style={{ minWidth: 320 }}>
				<Flex gap="2" align="center">
					<TextField.Standalone
						label="Purchase URL"
						variant="icon"
						size="1"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="https://..."
						autoFocus
						iconRight={
							hasUrl ? (
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => {
										e.stopPropagation();
										e.nativeEvent.stopImmediatePropagation();
										window.open(getFullUrl(url), '_blank', 'noopener,noreferrer');
										e.preventDefault();
									}}>
									<ExternalLinkIcon size={14} />
								</a>
							) : undefined
						}
					/>
					<Button size="2" iconLeft={<SaveIcon size={14} />} onClick={handleSave}>
						Save
					</Button>
					{hasUrl && (
						<IconButton
							size="2"
							variant="outline"
							color="neutral"
							label="Delete link"
							icon={<TrashIcon size={14} />}
							onClick={handleDelete}
						/>
					)}
				</Flex>
			</Popover.Content>
		</Popover.Root>
	);
};
