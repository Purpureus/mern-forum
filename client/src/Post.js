import { useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import useFetch from './useFetch';

const Post = () => {

	const history = useHistory();
	const { postId } = useParams();
	const [doFetch, fetchLoading, fetchError, post] = useFetch();

	useEffect(() => {
		const url = `http://localhost:8000/api/posts/${postId}`;

		doFetch(url);
	}, [postId, doFetch]);

	function deletePost() {
		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			method: 'DELETE'
		};

		doFetch(url, options, () => {
			history.push('/');
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
