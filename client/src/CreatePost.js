import { useState, useEffect, useContext, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';

import useFetch from './useFetch';
import LoginDataContext from './LoginDataContext';
import PostPersistContext from './PostPersistContext';

const CreatePost = () => {

    const history = useHistory();

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [doFetch, fetchLoading, fetchError] = useFetch();
    const [loginData, , logOut] = useContext(LoginDataContext);
    const [persistedPost, setPersistedPost] = useContext(PostPersistContext);
    const [saveDraftTimeout, setSaveDraftTimeout] = useState(null);

    useEffect(() => {
        if (fetchError && fetchError.accessTokenExpired) logOut();
    }, [fetchError, logOut]);

    const saveDraft = useCallback(() => {
        window.sessionStorage.setItem('post-draft', JSON.stringify({
            title: postTitle,
            content: postContent
        }));
    }, [postTitle, postContent]);

    useEffect(() => {
        if (saveDraftTimeout) clearTimeout(saveDraftTimeout);
        setSaveDraftTimeout(setTimeout(saveDraft, 1500));
        return clearTimeout(saveDraftTimeout);
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
                title: persistedPost.title,
                content: persistedPost.content
            })
        };

        doFetch(url, options, (data, error) => {
            if (error) return console.log(`Error submitting the post.`);
            setPersistedPost({ title: "", content: "" });
            history.push('/');
        });
    }

    let errorDisplayMessage = null;
    if (fetchError) {
        errorDisplayMessage = fetchError.accessTokenExpired
            ? <>Your session has expired. Please <Link to="/login" className="link painted">
                log in </Link> again.</>
            : <>An error occurred while creating the post: fetchError.error</>
    }

    return (
        <>
            {errorDisplayMessage &&
                <div className="error">{errorDisplayMessage}</div>
            }

            <form onSubmit={submitPost}>

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
