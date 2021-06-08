import { useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';

const Post = () => {

	const history = useHistory();
	const { postId } = useParams();
	const [post, setPost] = useState(null);
	const [fetchLoading, setFetchLoading] = useState(true);
	const [fetchError, setFetchError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();
		const url = `http://localhost:8000/api/posts/${postId}`;

		fetch(url, { signal: abortController.signal })
			.then(res => {
				if (!res.ok) {
					throw Error(`Couldn't fetch data from ${url}`);
				}
				return res.json();
			})
			.then(data => {
				setPost(data);
				setFetchLoading(false);
				setFetchError(null);
			})
			.catch(err => {
				if (err.name === 'AbortError') {
					console.log(`Fetch has been aborted (${err})`);
					return;
				}
				setFetchLoading(false);
				setFetchError(err.message);
			});

		return () => abortController.abort();
	}, [postId]);

	function deletePost() {
		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			method: 'DELETE'
		};

		fetch(url, options)
			.then(res => {
				if (!res.ok) {
					throw Error(`Couldn't fetch data from${url}`);
				}
				return res.json();
			})
			.then(() => {
				history.push('/');
			})
			.catch(err => {
				setFetchError(err.message);
			});
	}

	return (
		<>
			{ fetchError && <p className="error">An error occurred: {fetchError}</p>}
			{ fetchLoading && <p>Loading posts...</p>}

			{post &&
				<div className="post">
					<h1 className="post-title">
						{post.title}
					</h1>

					<Link className="post-author" to={`/ user / ${post.author} `}>
						By {post.author}
					</Link>

					<p className="post-content">
						{post.content}
					</p>

					<button className="button" id="delete-post"
						onClick={() => deletePost()}>
						Delete post
						</button>
				</div>
			}
		</>
	);
};

export default Post;
