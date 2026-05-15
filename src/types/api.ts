export type VariantOption = { name: string; value: string };

export type ApiResponse<T> = {
	success: true;
	data: T;
};

export type OrdersResponse = {
	orders: Order[];
	lastSyncedAt: string | null;
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
	due_date: string | null;
	workflow_stage_id: string | null;
	workflow_stage_name: string | null;
	workflow_stage_color: string | null;
	subtotal: string | null;
	shipping_total: string | null;
	grand_total: string | null;
	shipping_method: string | null;
	order_notes: string | null;
	order_url: string | null;
	fulfilled_on: string | null;
	tracking_number: string | null;
	tracking_url: string | null;
	carrier_name: string | null;
	currency: string;
	batch_name: string | null;
	batch_id: string | null;
	item_count: number;
	items_completed: number;
	created_at: string;
	updated_at: string;
};

export type OrderItem = {
	id: string;
	order_id: string;
	platform_sku: string | null;
	product_name: string;
	variant_label: VariantOption[] | null;
	quantity: number;
	unit_price: string | null;
	image_url: string | null;
	workflow_stage_id: string | null;
	workflow_stage_name: string | null;
	created_at: string;
	updated_at: string;
};

export type OrderDetail = Order & {
	workflow_stage_name: string | null;
	items: OrderItem[];
};

export type OrderWithItems = Order & {
	items: OrderItem[];
};

export type CompletedOrdersResponse = {
	orders: Order[];
	hasMore: boolean;
};

export type OrdersWithItemsResponse = {
	orders: OrderWithItems[];
	lastSyncedAt: string | null;
};

export type WorkflowStage = {
	id: string;
	store_id: string;
	name: string;
	position: number;
	color: string | null;
	is_default: boolean;
	is_complete: boolean;
};

export type WorkflowStagesResponse = {
	orderStages: WorkflowStage[];
	itemStages: WorkflowStage[];
};

export type ProductionSummaryItem = {
	platform_sku: string | null;
	product_name: string;
	variant_label: VariantOption[] | null;
	total_quantity: number;
};

export type FabricEntry = {
	material_type: string;
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
	material_type: string;
	piece: string;
	total_count: number;
};

export type MaterialsMismatch = {
	platform_sku: string | null;
	product_name: string;
	variant_label: VariantOption[] | null;
	product_id: string | null;
	variant_id: string | null;
};

export type MaterialsReport = {
	fabric: FabricEntry[];
	linear: LinearEntry[];
	hardware: HardwareEntry[];
	mismatches: MaterialsMismatch[];
};

export type WorkflowBoardOrder = Order & {
	batch_name: string | null;
	batch_id: string | null;
};

export type WorkflowBoardResponse = {
	orders: WorkflowBoardOrder[];
	stages: WorkflowStage[];
	activeBatches: { id: string; name: string }[];
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
	due_date: string | null;
	grand_total: string | null;
	workflow_stage_id: string | null;
	workflow_stage_name: string | null;
	workflow_stage_color: string | null;
};

export type BatchItem = {
	id: string;
	batch_id: string;
	platform_sku: string | null;
	product_name: string;
	variant_label: VariantOption[] | null;
	quantity: number;
	completed: boolean;
	created_at: string;
};

export type BatchOrderItem = {
	id: string;
	order_id: string;
	batch_order_id: string;
	platform_sku: string | null;
	product_name: string;
	variant_label: VariantOption[] | null;
	quantity: number;
	workflow_stage_id: string | null;
	workflow_stage_name: string | null;
	is_complete: boolean | null;
};

export type BatchMaterial = {
	id: string;
	batch_id: string;
	category: string;
	product_name: string | null;
	material_type: string | null;
	piece: string;
	color: string | null;
	width: string | null;
	quantity: string;
	completed: boolean;
	completed_qty: number;
	created_at: string;
};

export type ProductVariant = {
	id: string;
	product_id: string;
	platform_variant_id: string;
	platform_sku: string | null;
	name: string;
	price: string | null;
	sale_price: string | null;
	on_sale: boolean;
	stock_quantity: number | null;
	stock_unlimited: boolean;
	image_url: string | null;
	bom_item_count: number;
	created_at: string;
	updated_at: string;
};

export type Product = {
	id: string;
	store_id: string;
	platform_product_id: string;
	name: string;
	description: string | null;
	slug: string | null;
	is_visible: boolean;
	image_url: string | null;
	product_url: string | null;
	variant_count: number;
	variants: ProductVariant[];
	created_at: string;
	updated_at: string;
};

export type ProductDetail = Product & {
	variants: ProductVariant[];
};

export type ProductsResponse = {
	products: Product[];
	lastSyncedAt: string | null;
};

export type BomMaterialType = {
	id: string;
	store_id: string;
	name: string;
	measurement: 'count' | 'linear' | 'area';
	unit: string;
	tracks_color: boolean;
	tracks_size: boolean;
	position: number;
	created_at: string;
	updated_at: string;
};

export type Material = {
	id: string;
	store_id: string;
	material_type_id: string;
	color: string | null;
	size: string | null;
	purchase_url: string | null;
	created_at: string;
	updated_at: string;
};

export type BomItem = {
	id: string;
	store_id: string;
	material_id: string | null;
	measurement: 'count' | 'linear' | 'area';
	platform_sku: string;
	product_name: string;
	variant: string | null;
	piece: string;
	length: string | null;
	quantity: number;
	position: number;
	created_at: string;
	updated_at: string;
	material_type_id: string | null;
	material_type_name: string | null;
	color: string | null;
	size: string | null;
	purchase_url: string | null;
};

export type MaterialCatalogEntry = {
	material_type_id: string;
	material_type_name: string;
	color: string | null;
	size: string | null;
	purchase_url: string | null;
};

export type BomSuggestion = {
	piece: string;
	material_id: string | null;
	measurement: string;
	material_type_name: string | null;
	color: string | null;
	size: string | null;
	length: string | null;
	quantity: number;
	purchase_url: string | null;
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
