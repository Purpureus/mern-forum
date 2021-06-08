import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();
		options.signal = AbortController.signal;
		fetch(url)
			.then(res => {
				if (!res.ok) {
					throw Error(`Couldn't fetch data from ${url}`);
				}
				return res.json();
			})
			.then(data => {
				setData(data);
				setLoading(false);
				setError(null);
			})
			.catch(err => {
				if (err.name === 'AbortError') {
					setLoading(false);
				}
				setError(err.message);
			});

		return () => {
			abortController.abort();
		};
	});

	return [data, setData, loading, error];
}

export default useFetch;