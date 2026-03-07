import { Text, Badge, Table, cn } from '@artifact-ui/core';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { VariantBadges } from '@/components/variant-badges';
import { formatCurrency } from '@/utils/format';
import type { OrderItem } from '@/types/api';
import styles from './order-items-expanded.module.css';

type OrderItemsExpandedProps = {
	items: OrderItem[];
	colSpan: number;
};

export const OrderItemsExpanded = ({ items, colSpan }: OrderItemsExpandedProps) => (
	<Table.Row>
		<Table.Cell colSpan={colSpan} className="p-0">
			<div className={styles.container}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th className={styles.headerCell} colSpan={2}>
								<Text size="1" color="secondary" weight="medium">Product</Text>
							</th>
							<th className={styles.headerCell}>
								<Text size="1" color="secondary" weight="medium">Variant</Text>
							</th>
							<th className={cn(styles.headerCell, styles.qtyColumn)}>
								<Text size="1" color="secondary" weight="medium">Qty</Text>
							</th>
							<th className={cn(styles.headerCellRight, styles.priceColumn)}>
								<Text size="1" color="secondary" weight="medium">Price</Text>
							</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr key={item.id}>
								<td className={cn(styles.cell, styles.imageCell)}>
									<ProductThumbnail src={item.image_url} alt={item.product_name} />
								</td>
								<td className={styles.cell}>
									<Text size="2">{item.product_name}</Text>
								</td>
								<td className={styles.cell}>
									<VariantBadges variants={item.variant_label} />
								</td>
								<td className={cn(styles.cell, styles.qtyColumn)}>
									<Badge size="1" variant="outline" color="neutral">
										x{item.quantity}
									</Badge>
								</td>
								<td className={cn(styles.cellPrice, styles.priceColumn)}>
									<Text size="2" color="secondary">
										{item.unit_price ? formatCurrency(item.unit_price) : '—'}
									</Text>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Table.Cell>
	</Table.Row>
);
