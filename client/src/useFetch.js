// NOTE: Expected JSON response format for errors is as follows:
// { message: `error message` }

import { useEffect, useMemo, useCallback } from 'react';

function useFetch() {
	const abortController = useMemo(() => new AbortController(), []);

	useEffect(() => {
		return (() => abortController.abort());
	}, [abortController]);

	const doFetch = useCallback((url, options = {}, then = () => { }) => {
		options.signal = abortController.signal;

		fetch(url, options)
			.then(res => {
				if (!res.ok) {
					return res.json().then(response => { throw Error(JSON.stringify(response)) });
				}
				return res.json();
			})
			.then(data => {
				then(data, null);
			})
			.catch(err => {
				if (err.name === 'AbortError') {
					console.log(`Fetch has been aborted (${err})`);
					return;
				}
				let errorMessage = "";
				try {
					errorMessage = JSON.parse(err.message);
				} catch (error) {
					errorMessage = `JSON.parse error: ${error}. JSON data: ${err.message}`;
				}
				then(null, errorMessage);
			});
	}, [abortController.signal]);

	return [doFetch];
}

export default useFetch;