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

export type Batch = {
	id: string;
	store_id: string;
	name: string;
	status: string;
	completed_at: string | null;
	order_count: number;
	item_count: number;
	items_completed: number;
	created_at: string;
	updated_at: string;
};

export type BatchOrder = {
	id: string;
	order_id: string;
	completed: boolean;
	order_number: string;
	customer_name: string;
	order_date: string;
	grand_total: string | null;
};

export type BatchItem = {
	id: string;
	batch_id: string;
	platform_sku: string | null;
	product_name: string;
	variant_label: string | null;
	quantity: number;
	completed: boolean;
	created_at: string;
};

export type BatchOrderItem = {
	id: string;
	batch_id: string;
	batch_order_id: string;
	platform_sku: string | null;
	product_name: string;
	variant_label: string | null;
	quantity: number;
	completed: boolean;
	completed_qty: number;
	created_at: string;
};

export type BatchMaterial = {
	id: string;
	batch_id: string;
	category: string;
	material_type: string | null;
	piece: string;
	color: string | null;
	width: string | null;
	quantity: string;
	completed: boolean;
	completed_qty: number;
	created_at: string;
};

export type BatchDetail = {
	id: string;
	store_id: string;
	name: string;
	status: string;
	completed_at: string | null;
	created_at: string;
	updated_at: string;
	orders: BatchOrder[];
	items: BatchItem[];
	orderItems: BatchOrderItem[];
	materials: BatchMaterial[];
};
