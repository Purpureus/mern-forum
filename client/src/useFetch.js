import { useCallback } from 'react';

function useFetch(url) {

	const doFetch = useCallback((url) => {
		console.log('Fetching...');
	}, []);

	return [doFetch];
}

export default useFetch;