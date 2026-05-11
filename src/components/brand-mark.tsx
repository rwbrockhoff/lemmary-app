import { Heading, Flex } from '@artifact-ui/core';
import { LogoIcon } from './icons';

type BrandMarkProps = {
	size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
	sm: { icon: 20, heading: '4' as const },
	md: { icon: 24, heading: '5' as const },
	lg: { icon: 28, heading: '6' as const },
};

export const BrandMark = ({ size = 'md' }: BrandMarkProps) => {
	const { icon, heading } = sizeMap[size];

	return (
		<Flex align="center" gap="2">
			<LogoIcon size={icon} />
			<Heading size={heading}>Lemmary</Heading>
		</Flex>
	);
};
