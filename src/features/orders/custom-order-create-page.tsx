import { PageHeader } from '@/components/page-header';
import { CustomOrderForm } from './components/custom-order-form/custom-order-form';
import shared from '@/styles/shared.module.css';

const CustomOrderCreatePage = () => {
	return (
		<div className={shared.pageContainer}>
			<PageHeader
				segments={[{ label: 'Orders', to: '/orders' }]}
				title="New custom order"
			/>
			<CustomOrderForm mode="create" />
		</div>
	);
};

export default CustomOrderCreatePage;
