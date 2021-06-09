import { LoginDataContext } from './LoginDataContext';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useFetch from './useFetch';

const CreatePost = () => {

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [loginData] = useContext(LoginDataContext);
    const history = useHistory();

    const [doFetch] = useFetch();
    const [, setPosts] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

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
            })
        };

        fetch(url, options)
            .then(res => {
                if (!res.ok) {
                    throw Error(`Couldn't fetch data from ${url}`);
                }
                return res.json();
            })
            .then(posts => {
                setPosts(posts);
                setFetchError(null);
                setFetchLoading(false);
                return (history.go(-1));
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    setFetchLoading(false);
                }
            });
    }

    return (
        <>
            {loginData.logged
                ? <form onSubmit={submitPost}>

                    <h1>Create post</h1>
                    {fetchError && <p className="error">An error occurred: {fetchError}</p>}

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
