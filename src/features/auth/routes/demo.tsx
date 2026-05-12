import { useEffect, useRef } from 'react';
import { PageSpinner } from '@/components/page-spinner';
import { useDemoLogin } from '../hooks/use-demo-login';

const DemoPage = () => {
	const demoLogin = useDemoLogin();
	const fired = useRef(false);

	useEffect(() => {
		if (fired.current) return;
		fired.current = true;
		demoLogin.mutate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <PageSpinner />;
};

export default DemoPage;
