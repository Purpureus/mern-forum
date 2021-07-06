// Expected JSON response format for errors is as follows:
// { error: `error message` }

import { useState, useEffect, useMemo, useCallback } from 'react';

function useFetch() {
	const [fetchLoading, setFetchLoading] = useState(false);
	const [fetchError, setFetchError] = useState(null);
	const [fetchData, setFetchData] = useState(null);

	const abortController = useMemo(() => new AbortController(), []);

	useEffect(() => {
		return (() => abortController.abort());
	}, [abortController]);

	const doFetch = useCallback((url, options = {}, then = () => { }) => {
		options.signal = abortController.signal;

		console.log('Fetching');
		fetch(url, options)
			.then(res => {
				if (!res.ok) {
					return res.json().then(response => { throw Error(JSON.stringify(response)) });
				}
				return res.json();
			})
			.then(data => {
				setFetchLoading(false);
				setFetchError(null);
				setFetchData(data);
				then(data);
			})
			.catch(err => {
				if (err.name === 'AbortError') {
					console.log(`Fetch has been aborted (${err})`);
					return;
				}
				setFetchLoading(false);
				setFetchError(JSON.parse(err.message));
				then(null, JSON.parse(err.message));
			});
	}, [abortController.signal]);

	return [doFetch, fetchLoading, fetchError, fetchData];
}

export default useFetch;