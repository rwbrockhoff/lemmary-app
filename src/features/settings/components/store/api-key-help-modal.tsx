import { useState } from 'react';
import { Modal, Button, Text, Stack } from '@artifact-ui/core';
import { KeyIcon } from '@/components/icons';

const API_KEY_DOCS_URL =
	'https://support.squarespace.com/hc/en-us/articles/236297987-Squarespace-API-keys';

const steps = [
	'In your Squarespace dashboard, open Settings → Developer API Keys.',
	'Click Generate Key.',
	'Name the key and select the Orders API.',
	'Copy the key right away. Squarespace only shows it once.',
];

export const ApiKeyHelpModal = () => {
	const [open, setOpen] = useState(false);

	return (
		<Modal.Root open={open} onOpenChange={setOpen}>
			<Modal.Trigger asChild>
				<Button variant="link" size="1" type="button" className="cursor-pointer">
					Where do I find this?
				</Button>
			</Modal.Trigger>
			<Modal.Content
				variant="simple"
				size="1"
				ariaDescription="How to find your Squarespace API key">
				<Modal.Header>
					<Modal.Title iconLeft={<KeyIcon size={18} />}>
						Find your API key
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Stack gap="4">
						<ol className="list-decimal pl-5 flex flex-col gap-2">
							{steps.map((step) => (
								<li key={step}>
									<Text as="span" size="2">
										{step}
									</Text>
								</li>
							))}
						</ol>
						<Button variant="link" size="1" asChild className="cursor-pointer">
							<a href={API_KEY_DOCS_URL} target="_blank" rel="noreferrer">
								Squarespace's API key guide
							</a>
						</Button>
					</Stack>
				</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	);
};
