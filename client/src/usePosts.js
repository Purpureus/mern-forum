import { useState, useEffect } from 'react';

function usePosts(options = {}) {
	const [posts, setPosts] = useState(null);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	const url = `http://localhost:8000/api/posts`;

	useEffect(() => {
		fetch(url, options)
			.then(res => {
				if (!res.ok) {
					throw Error(`Couldn't fetch data from ${url}`);
				}
				return res.json();
			})
			.then(data => {
				setPosts(data);
				setIsPending(false);
				setError(null);
			})
			.catch(err => {
				setIsPending(false);
				setError(err.message);
			});
	}, [url]);

	return [posts, setPosts, isPending, error];
}

export default usePosts;