import { useEffect, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import useFetch from './useFetch';

import { LoginDataContext } from './LoginDataContext';

const Post = () => {

	const history = useHistory();
	const { postId } = useParams();
	const [doFetch, fetchLoading, fetchError, fetchData] = useFetch();

	const [loginData] = useContext(LoginDataContext);

	useEffect(() => {
		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			headers: {
				'Authorization': `Bearer: ${loginData.accessToken}`
			}
		};
		doFetch(url, options);
	}, [postId, doFetch, loginData]);

	function deletePost() {
		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer: ${loginData.accessToken}`
			}
		};

		doFetch(url, options, (data, error) => {
			if (error) return;
			history.push('/');
		});
	}

	return (
		<>
			{ fetchError && <p className="error">An error occurred: {fetchError}</p>}
			{ fetchLoading && <p>Loading posts...</p>}

			{fetchData && fetchData.post &&
				<div className="post">
					<h1 className="post-title">
						{fetchData.post.title}
					</h1>

					<Link className="post-author" to={`/ user / ${fetchData.post.author} `}>
						By {fetchData.post.author}
					</Link>

					<p className="post-content">
						{fetchData.post.content}
					</p>

					{fetchData.canDelete &&
						<button className="button"
							id="delete-post"
							onClick={() => deletePost()}>
							Delete post
					</button>
					}
				</div>
			}
		</>
	);
};

export default Post;
