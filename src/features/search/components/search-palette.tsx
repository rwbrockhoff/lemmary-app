import { useMemo, useState, type ReactNode, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { Modal, TextField, Text } from '@artifact-ui/core';
import {
	OrdersIcon,
	StorefrontIcon,
	CustomersIcon,
	SearchIcon,
} from '@/components/icons';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useSearch, type SearchResults } from '../api/search-queries';
import styles from './search-palette.module.css';
import shared from '@/styles/shared.module.css';

type SearchPaletteProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type ResultItem = {
	key: string;
	to: string;
	group: string;
	primary: string;
	secondary?: string;
	icon: ReactNode;
};

const buildItems = (results: SearchResults): ResultItem[] => {
	const items: ResultItem[] = [];

	for (const order of results.orders) {
		items.push({
			key: `order-${order.id}`,
			to: `/orders/${order.id}`,
			group: 'Orders',
			primary: `#${order.order_number}`,
			secondary: order.customer_name ?? undefined,
			icon: <OrdersIcon size={16} />,
		});
	}
	for (const product of results.products) {
		items.push({
			key: `product-${product.id}`,
			to: `/storefront/${product.id}`,
			group: 'Products',
			primary: product.name,
			icon: <StorefrontIcon size={16} />,
		});
	}
	for (const customer of results.customers) {
		items.push({
			key: `customer-${customer.email}`,
			to: `/customers/${encodeURIComponent(customer.email)}`,
			group: 'Customers',
			primary: customer.name || customer.email,
			secondary: customer.name ? customer.email : undefined,
			icon: <CustomersIcon size={16} />,
		});
	}
	return items;
};

export const SearchPalette = ({ open, onOpenChange }: SearchPaletteProps) => {
	const navigate = useNavigate();
	const [query, setQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState(0);
	const debounced = useDebouncedValue(query, 200);
	const { data } = useSearch(debounced);

	const items = useMemo(() => (data ? buildItems(data) : []), [data]);

	// Move the highlight back to the top when the results change
	const [prevItems, setPrevItems] = useState(items);
	if (items !== prevItems) {
		setPrevItems(items);
		setActiveIndex(0);
	}

	// Reset the query when the palette closes so it opens fresh
	const [wasOpen, setWasOpen] = useState(open);
	if (open !== wasOpen) {
		setWasOpen(open);
		if (!open) setQuery('');
	}

	const select = (item: ResultItem) => {
		navigate(item.to);
		onOpenChange(false);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActiveIndex((i) => Math.min(i + 1, items.length - 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActiveIndex((i) => Math.max(i - 1, 0));
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const item = items[activeIndex];
			if (item) select(item);
		}
	};

	const hasQuery = query.trim().length > 0;

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content size="2" ariaDescription="Search orders, products, and customers">
				<Modal.Title className={shared.srOnly}>Search</Modal.Title>
				<Modal.Body>
					<TextField.Standalone
						variant="icon"
						size="3"
						iconLeft={<SearchIcon size={18} />}
						placeholder="Search orders, products, customers…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						clearable={query.length > 0}
						onClear={() => setQuery('')}
						autoFocus
					/>

					{hasQuery && items.length === 0 && (
						<Text size="2" color="secondary" className={styles.empty}>
							No results
						</Text>
					)}

					{hasQuery && items.length > 0 && (
						<div className={styles.results}>
							{items.map((item, index) => {
								const showGroup = index === 0 || items[index - 1].group !== item.group;
								return (
									<div key={item.key}>
										{showGroup && <div className={styles.groupLabel}>{item.group}</div>}
										<button
											type="button"
											className={`${styles.item} ${index === activeIndex ? styles.itemActive : ''}`}
											onClick={() => select(item)}
											onMouseMove={() => setActiveIndex(index)}>
											<span className={styles.itemIcon}>{item.icon}</span>
											<span className={styles.itemText}>
												<span className={styles.itemPrimary}>{item.primary}</span>
												{item.secondary && (
													<span className={styles.itemSecondary}>{item.secondary}</span>
												)}
											</span>
										</button>
									</div>
								);
							})}
						</div>
					)}
				</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	);
};
