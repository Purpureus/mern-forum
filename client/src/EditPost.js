import { useState, useEffect, useContext } from 'react';
import useFetch from './useFetch';
import { useParams, useHistory, Prompt } from 'react-router-dom';
import Login from './Login';

import LoginDataContext from './LoginDataContext';

const EditPost = () => {

	const history = useHistory();
	const { postId } = useParams();
	const [postTitle, setPostTitle] = useState("");
	const [postContent, setPostContent] = useState("");
	const [doFetch, fetchLoading, fetchError] = useFetch();
	const [loginData, ,] = useContext(LoginDataContext);
	const [viewLoginForm, setViewLoginForm] = useState(false);
	const [loggedInMessage, setLoggedInMessage] = useState("");

	const [originalTitle, setOriginalTitle] = useState("");
	const [originalContent, setOriginalContent] = useState("");

	const [accessToken] = useState(loginData.accessToken);

	useEffect(() => {
		// Alert about unsaved changes
		function alertUser(e) {
			e.preventDefault();
			e.returnValue = '';
		}
		window.addEventListener('beforeunload', alertUser);
		return () => {
			window.removeEventListener('beforeunload', alertUser);
		};
	}, []);

	useEffect(() => {
		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			headers: {
				'Authorization': `Bearer: ${accessToken}`
			}
		};
		doFetch(url, options, (data, error) => {
			if (error) return;
			setPostTitle(data.post.title);
			setPostContent(data.post.content);
			setOriginalTitle(data.post.title);
			setOriginalContent(data.post.content);
		});
	}, [doFetch, accessToken, postId]);

	function submitPost(e = null) {
		if (e) e.preventDefault();

		const url = `http://localhost:8000/api/posts/${postId}`;
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer: ${loginData.accessToken}`
			},
			body: JSON.stringify({
				title: postTitle,
				content: postContent
			})
		};

		doFetch(url, options, (data, error) => {
			if (error) {
				if (error.accessTokenExpired) {
					setViewLoginForm(true);
				}
				return console.log(`Error when submitting the post`);
			}
			setOriginalTitle(postTitle);
			setOriginalContent(postContent);
			history.push('/');
		});
	}

	let errorDisplayMessage = null;
	if (fetchError && !fetchError.accessTokenExpired) {
		errorDisplayMessage = <>
			An error occurred while updating the post: {fetchError.error}
		</>
	}

	function postHasChanged() {
		return originalTitle !== postTitle || originalContent !== postContent;
	}

	return (
		<>
			<Prompt
				when={postHasChanged()}
				message={() => `If you leave this page, unsaved changes won't be saved.`}
			/>

			{viewLoginForm &&
				<div className="floating-form">
					<div className="container">
						<button className="close-container"
							onClick={() => { setViewLoginForm(false) }}>&#9587;</button>
						<Login onSubmit={() => {
							setViewLoginForm(false);
							setLoggedInMessage("You have been logged in successfully.");
						}} />
					</div>
				</div>
			}

			{errorDisplayMessage &&
				<div className="error">{errorDisplayMessage}</div>
			}

			{loggedInMessage &&
				<div className="success">{loggedInMessage}</div>
			}

			<form className="default-form" onSubmit={(e) => submitPost(e)}>

				<h1>Edit post</h1>

				<label htmlFor="post-title">Post title</label>
				<input name="post-title" required maxLength="99"
					placeholder="Title"
					autoComplete="off"
					type="text"
					value={postTitle}
					onChange={(e) => setPostTitle(e.target.value)} />

				<label htmlFor="post-content">Post content</label>
				<textarea rows="10" cols="30" required maxLength="999"
					id="post-content"
					placeholder="Content"
					value={postContent}
					onChange={(e) => setPostContent(e.target.value)}
					name="post-content"></textarea>

				<input name="post-submit" type="submit"
					className={`${postHasChanged() ? '' : 'disabled'}`}
					value={fetchLoading ? `Submitting post...` : `Submit post`} />

			</form>
		</>
	);
};

export default EditPost;