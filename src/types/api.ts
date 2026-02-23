export type ApiResponse<T> = {
	success: true;
	data: T;
};

export type Order = {
	id: string;
	store_id: string;
	platform_order_id: string;
	order_number: string;
	customer_name: string;
	customer_email: string | null;
	order_date: string;
	fulfillment_status: string;
	subtotal: string | null;
	shipping_total: string | null;
	grand_total: string | null;
	currency: string;
	item_count: number;
	created_at: string;
	updated_at: string;
};
