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

	function pinPost(value) {
		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer: ${loginData.accessToken}`
			},
			body: JSON.stringify({
				pinned: value
			})
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
					<h1 id="post-title">
						{fetchData.post.title}
					</h1>

					<p id="post-author">
						By {fetchData.post.author}
					</p>

					{(fetchData.isAdmin || fetchData.isAuthor) &&
						<Link id="edit-post" to={`${postId}/edit`}>Edit post</Link>
					}

					<p id="post-content">
						{fetchData.post.content}
					</p>

					{(fetchData.isAdmin || fetchData.isAuthor) && <>
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

					{fetchData.isAdmin && <><br />
						{fetchData.post.pinned ?
							<button id="pin-post" className="button rounded-button blue"
								onClick={() => pinPost(false)}>
								Unpin post
							</button> :
							<button id="pin-post" className="button rounded-button blue"
								onClick={() => pinPost(true)}>
								Pin post
							</button>
						}
					</>}
				</div>
			}
		</>
	);
};

export default Post;
