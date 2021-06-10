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

		fetch(url, options)
			.then(res => {
				if (!res.ok) {
					throw Error(`Couldn't fetch data from ${url}`);
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
					return console.log(`Fetch has been aborted (${err})`);
				}
				setFetchLoading(false);
				setFetchError(err.message);
			});
	}, [abortController.signal]);

	return [doFetch, fetchLoading, fetchError, fetchData];
}

export default useFetch;