import { useState, useEffect, useContext } from 'react';
import useFetch from './useFetch';
import { Link, useParams, useHistory, Prompt } from 'react-router-dom';
import LoginForm from './LoginForm';

import LoginDataContext from './LoginDataContext';

const EditPost = () => {

	const history = useHistory();
	const { postId } = useParams();
	const [postTitle, setPostTitle] = useState("");
	const [postContent, setPostContent] = useState("");
	const [doFetch, fetchLoading, fetchError] = useFetch();
	const [loginData, ,] = useContext(LoginDataContext);

	const [originalTitle, setOriginalTitle] = useState("");
	const [originalContent, setOriginalContent] = useState("");

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
				'Authorization': `Bearer: ${loginData.accessToken}`
			}
		};
		doFetch(url, options, (data, error) => {
			if (error) return;
			setPostTitle(data.post.title);
			setPostContent(data.post.content);
			setOriginalTitle(data.post.title);
			setOriginalContent(data.post.content);
		});
	}, [doFetch, loginData.accessToken, postId]);

	function submitPost(e) {
		e.preventDefault();

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
			if (error) return console.log(`Error when submitting the post`);
			setOriginalTitle(postTitle);
			setOriginalContent(postContent);
			history.go(-1);
		});
	}

	let errorDisplayMessage = null;
	if (fetchError) {
		errorDisplayMessage = fetchError.accessTokenExpired
			? <>Your session has expired. Please <Link to="/login" className="link painted">
				log in </Link> again.</>
			: <>An error occurred while updating the post: {fetchError.error}</>
	}

	function postHasChanged() {
		return originalTitle !== postTitle || originalContent !== postContent;
	}

	return (
		<>
			{/* <LoginForm></LoginForm> */}

			<Prompt
				when={postHasChanged()}
				message={() => `If you leave this page, unsaved changes won't be saved.`}
			/>

			{errorDisplayMessage &&
				<div className="error">{errorDisplayMessage}</div>
			}

			<form onSubmit={(e) => submitPost(e)}>

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

				{/* {fetchError &&
					<p>{fetchError}</p>
				} */}

				<input name="post-submit" type="submit"
					value={fetchLoading ? `Submitting post...` : `Submit post`} />

			</form>
		</>
	);
};

export default EditPost;