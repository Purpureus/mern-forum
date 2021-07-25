import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Login from './Login';
import useFetch from './useFetch';
import LoginDataContext from './LoginDataContext';

const CreatePost = () => {

    const history = useHistory();

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [doFetch, fetchLoading, fetchError] = useFetch();
    const [loginData, , logOut] = useContext(LoginDataContext);
    const [viewLoginForm, setViewLoginForm] = useState(false);
    const [loggedInMessage, setLoggedInMessage] = useState("");

    const saveDraftTimeout = useRef(null);

    const saveDraft = useCallback(() => {
        console.log('Saving draft...');
        window.sessionStorage.setItem('post-draft', JSON.stringify({
            title: postTitle,
            content: postContent
        }));
    }, [postTitle, postContent]);

    useEffect(() => {
        const savedDraft = JSON.parse(window.sessionStorage.getItem('post-draft'))
            || { title: "", content: "" };
        setPostTitle(savedDraft.title);
        setPostContent(savedDraft.content);
    }, []);

    useEffect(() => {
        if (fetchError && fetchError.accessTokenExpired) logOut();
    }, [fetchError, logOut]);

    useEffect(() => {
        if (saveDraftTimeout.current) {
            clearTimeout(saveDraftTimeout.current);
        }
        saveDraftTimeout.current = setTimeout(saveDraft, 1500);
    }, [postTitle, postContent, saveDraft]);

    function submitPost(e) {
        e.preventDefault();

        const url = `http://localhost:8000/api/posts`;
        const options = {
            method: 'POST',
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
                return console.log(`Error submitting the post.`);
            }
            window.sessionStorage.setItem('post-draft', JSON.stringify({
                title: "",
                content: ""
            }));
            clearTimeout(saveDraftTimeout.current);
            history.push('/');
        });
    }

    let errorDisplayMessage = null;
    if (fetchError && !fetchError.accessTokenExpired) {
        errorDisplayMessage = <>
            An error occurred while creating the post: {fetchError.error}
        </>
    }

    return (
        <>
            {viewLoginForm &&
                <div className="floating-form">
                    <div className="container">
                        <button className="close-container"
                            onClick={() => { setViewLoginForm(false) }}>&#9587;</button>
                        <Login floating={true} onSubmit={() => {
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

            <form className="default-form" onSubmit={submitPost}>

                <h1>Create post</h1>

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
                    value={fetchLoading ? "Submitting..." : "Submit post"} />

            </form>
        </>
    );
};

export default CreatePost;
