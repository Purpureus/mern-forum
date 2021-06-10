import { LoginDataContext } from './LoginDataContext';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useFetch from './useFetch';

const CreatePost = () => {

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [loginData] = useContext(LoginDataContext);
    const history = useHistory();

    const [doFetch] = useFetch();
    const [fetchLoading, setFetchLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const abortController = useMemo(() => {
        return (new AbortController());
    }, []);

    useEffect(() => {
        return (() => abortController.abort());
    }, [abortController]);

    function submitPost(e) {
        e.preventDefault();

        doFetch();

        setFetchLoading(false);
        const url = `http://localhost:8000/api/posts`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: postTitle,
                content: postContent
            }),
            signal: abortController.signal
        };

        fetch(url, options)
            .then(res => {
                if (!res.ok) {
                    throw Error(`Couldn't fetch data from ${url}`);
                }
                return res.json();
            })
            .then(res => {
                setFetchError(null);
                setFetchLoading(false);
                return (history.go(-1));
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    return console.log(`Fetch has been aborted (${err})`);
                }
                setFetchLoading(false);
                setFetchError(err.message);
            });
    }

    return (
        <>
            {fetchError && <p className="error">An error occurred: {fetchError}</p>}
            {loginData.logged
                ? <form onSubmit={submitPost}>

                    <h1>Create post</h1>

                    <label htmlFor="post-title">Post title</label>
                    <input name="post-title" required maxLength="99"
                        placeholder="Title"
                        autoComplete="off"
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)} />

                    <label htmlFor="post-content">Post content</label>
                    <textarea rows="10" cols="30" required max="999"
                        id="post-content"
                        placeholder="Content"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        name="post-content"></textarea>

                    <input name="post-submit" type="submit"
                        value={fetchLoading ? "Submitting..." : "Submit post"} />

                </form>
                : <div className="error">
                    You're not logged in. Please <Link to="/login" className="link painted">log in </Link> to continue.
               </div>}
        </>
    );
};

export default CreatePost;
