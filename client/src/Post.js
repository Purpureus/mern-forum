import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import useFetch from './useFetch';

import LoginDataContext from './LoginDataContext';

const Post = () => {

	const history = useHistory();
	const { postId } = useParams();
	const [clickDelete, setClickDelete] = useState(false);
	const [doFetch, fetchLoading, fetchError, fetchData] = useFetch();
	const [loginData, ,] = useContext(LoginDataContext);

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

	let errorDisplayMessage = null;
	if (fetchError) {
		const sessionExpiredMessage = <>
			Your session has expired. Please
			<Link to="/login" className="link painted"> log in </Link> again.
		</>;
		const errorMessage = <>An error occurred: {fetchError.error}</>;

		errorDisplayMessage = fetchError.accessTokenExpired
			? sessionExpiredMessage
			: errorMessage;
	}

	errorDisplayMessage = errorDisplayMessage &&
		<div className="error">{errorDisplayMessage}</div>;

	return (
		<>
			{errorDisplayMessage}
			{ fetchLoading && <p>Loading posts...</p>}

			{fetchData && fetchData.post &&
				<div className="post">
					<h1 className="post-title">
						{fetchData.post.title}
					</h1>

					<Link
						className="post-author"
						to={`/ user / ${fetchData.post.author} `}>
						By {fetchData.post.author}
					</Link>

					<p className="post-content">
						{fetchData.post.content}
					</p>

					{fetchData.canDelete && <>
						{clickDelete ||
							<button id="delete-post"
								className="button rounded-button red"
								onClick={() => setClickDelete(true)}>
								Delete post
							</button>
						}

						{clickDelete && <>
							<div className="confirm-delete flex row center-vert">
								<p>This action cannot be undone.</p>
								<button id="delete-post-cancel"
									className="button cancel"
									onClick={() => setClickDelete(false)}>
									Don't delete
								</button>
								<button id="delete-post-confirm"
									className="button confirm"
									onClick={() => deletePost()}>
									Delete anyways
								</button>
							</div>
						</>}
					</>}
				</div>
			}
		</>
	);
};

export default Post;
