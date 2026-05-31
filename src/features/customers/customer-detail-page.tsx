import { useParams, useSearchParams } from 'react-router';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { CustomerHeader } from './components/customer-header';
import { CustomerOrdersTable } from './components/customer-orders-table';
import { useCustomer } from './api/customers-queries';
import { getCustomerBreadcrumbs } from './utils/customer-breadcrumbs';
import shared from '@/styles/shared.module.css';

const CustomerDetailPage = () => {
	const { email: encodedEmail } = useParams<{ email: string }>();
	const [searchParams] = useSearchParams();
	const email = encodedEmail ? decodeURIComponent(encodedEmail) : '';
	const { data: customer, isLoading, error } = useCustomer(email);

	const from = searchParams.get('from');
	const orderId = searchParams.get('orderId');
	const breadcrumbs = getCustomerBreadcrumbs(from, orderId);

	return (
		<div className={shared.pageContainer}>
			<PageHeader segments={breadcrumbs} title={customer?.name} />
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error || (!isLoading && !customer)}
				errorState={<ErrorState description="Failed to load customer." />}>
				{customer && (
					<div className="flex flex-col gap-8">
						<CustomerHeader customer={customer} />
						<CustomerOrdersTable orders={customer.orders} />
					</div>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default CustomerDetailPage;
