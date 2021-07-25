import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import useFetch from './useFetch';

import LoginDataContext from './LoginDataContext';

const Post = () => {

	const history = useHistory();
	const { postId } = useParams();
	const [clickDelete, setClickDelete] = useState(false);

	const [doFetch] = useFetch();
	const [post, setPost] = useState(null);
	const [postFetchLoading, setPostFetchLoading] = useState(false);
	const [postFetchError, setPostFetchError] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAuthor, setIsAuthor] = useState(false);

	const [loginData, ,] = useContext(LoginDataContext);

	useEffect(() => {
		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			headers: {
				'Authorization': `Bearer: ${loginData.accessToken}`
			}
		};
		setPostFetchLoading(true);
		doFetch(url, options, (data, error) => {
			setPostFetchLoading(false);
			setPostFetchError(error);
			if (error) return;
			setPost(data.post);
			setIsAdmin(data.isAdmin);
			setIsAuthor(data.isAuthor);
		});
	}, [postId, doFetch, loginData]);

	function deletePost() {
		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer: ${loginData.accessToken}`
			}
		};

		setPostFetchLoading(true);
		doFetch(url, options, (data, error) => {
			setPostFetchLoading(false);
			setPostFetchError(error);
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
	if (postFetchError) {
		const sessionExpiredMessage = <>
			Your session has expired. Please
			<Link to="/login" className="link painted"> log in </Link> again.
		</>;
		const errorMessage = <>An error occurred: {postFetchError.error}</>;

		errorDisplayMessage = postFetchError.accessTokenExpired
			? sessionExpiredMessage
			: errorMessage;
	}

	errorDisplayMessage = errorDisplayMessage &&
		<div className="error">{errorDisplayMessage}</div>;

	return (
		<>
			{errorDisplayMessage}
			{ postFetchLoading && <p>Loading posts...</p>}

			{post && post &&
				<div className="post">
					<h1 id="post-title">
						{post.title}
					</h1>

					<p id="post-author">
						By {post.author}
					</p>

					{(isAdmin || isAuthor) &&
						<Link id="edit-post" to={`${postId}/edit`}>Edit post</Link>
					}

					<p id="post-content">
						{post.content}
					</p>

					{(isAdmin || isAuthor) && <>
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

					{isAdmin && <><br />
						{post.pinned ?
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
