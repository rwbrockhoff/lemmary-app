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

export type ProductionSummaryItem = {
	platform_sku: string | null;
	product_name: string;
	variant_label: string | null;
	total_quantity: number;
};

export type FabricEntry = {
	product_name: string;
	piece: string;
	color: string;
	total_quantity: number;
};

export type LinearEntry = {
	material_type: string;
	width: number | null;
	total_inches: number;
	total_feet: number;
	feet_to_order: number;
};

export type HardwareEntry = {
	piece: string;
	total_count: number;
};

export type MaterialsMismatch = {
	platform_sku: string | null;
	product_name: string;
	variant_label: string | null;
};

export type MaterialsReport = {
	fabric: FabricEntry[];
	linear: LinearEntry[];
	hardware: HardwareEntry[];
	mismatches: MaterialsMismatch[];
};
