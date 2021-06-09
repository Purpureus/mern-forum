import { LoginDataContext } from './LoginDataContext';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import useFetch from './useFetch';

const PostList = () => {

    const [loginData] = useContext(LoginDataContext);

    const [posts, setPosts] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [doFetch] = useFetch();

    useEffect(() => {
        const abortController = new AbortController();
        const url = `http://localhost:8000/api/posts`;

        doFetch();

        fetch(url, { signal: abortController.signal })
            .then(res => {
                if (!res.ok) {
                    throw Error(`Couldn't fetch data from ${url}`)
                }
                return res.json();
            })
            .then(data => {
                setPosts(data);
                setFetchLoading(false);
                setFetchError(null);
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    return console.log(`Fetch has been aborted (${err})`);
                }
                setFetchLoading(false);
                setFetchError(err.message);
            });

        return () => abortController.abort();
    }, [doFetch]);

    return (
        <>
            { fetchError && <p className="error">An error occurred: {fetchError}</p>}
            { fetchLoading && <p>Loading posts...</p>}

            <div className="post-list">

                <div className="item post-list-controls">
                    <div>Post title</div>

                    <div className="flex-separator"></div>

                    {loginData.logged && <Link to="/createpost" className="link">Create post</Link>}
                </div>

                {posts && posts.map((post, postIndex) => (
                    <div className="post item" key={postIndex}>

                        <Link to={`/post/${post.postId}`} className="post-title">{post.title}</Link>

                        <div className="flex-separator"></div>

                        <p>By</p>
                        <Link to={`/user/${post.author}`} className="post-author">{post.author}</Link>

                    </div>
                ))}

            </div>
        </>
    );
};

export default PostList;
