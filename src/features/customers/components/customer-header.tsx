import { Flex, Heading, Stack, Text } from '@artifact-ui/core';
import { CustomerTierBadge } from './customer-tier-badge';
import { formatCurrencyShort, formatDate } from '@/utils/format';
import type { CustomerDetail } from '@/types/api';

type CustomerHeaderProps = {
	customer: CustomerDetail;
};

export const CustomerHeader = ({ customer }: CustomerHeaderProps) => {
	const lifetimeSpend = Number(customer.lifetimeSpend);
	const avgOrderValue = customer.orderCount > 0 ? lifetimeSpend / customer.orderCount : 0;

	return (
		<Flex justify="between" align="center" gap="8" className="flex-wrap pr-8">
			<Stack gap="2">
				<Flex align="center" gap="3" className="flex-wrap">
					<Heading size="6">{customer.name}</Heading>
					<CustomerTierBadge tier={customer.tier} />
				</Flex>
				<Text size="2" color="secondary">
					{customer.email}
				</Text>
			</Stack>

			<Flex gap="8" className="flex-wrap">
				<Stack gap="1">
					<Text size="2" color="secondary">
						Total orders
					</Text>
					<Text size="4" weight="medium">
						{customer.orderCount}
					</Text>
				</Stack>
				<Stack gap="1">
					<Text size="2" color="secondary">
						Lifetime spend
					</Text>
					<Text size="4" weight="medium">
						{formatCurrencyShort(lifetimeSpend)}
					</Text>
				</Stack>
				<Stack gap="1">
					<Text size="2" color="secondary">
						Avg order
					</Text>
					<Text size="4" weight="medium">
						{formatCurrencyShort(avgOrderValue)}
					</Text>
				</Stack>
				<Stack gap="1">
					<Text size="2" color="secondary">
						Customer since
					</Text>
					<Text size="4" weight="medium">
						{formatDate(customer.firstOrderDate)}
					</Text>
				</Stack>
			</Flex>
		</Flex>
	);
};
