import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import useFetch from './useFetch';
import { LoginDataContext } from './LoginDataContext';

const PostList = () => {

    const [doFetch, fetchLoading, fetchError, posts] = useFetch();
    const [loginData] = useContext(LoginDataContext);

    useEffect(() => {
        const url = `http://localhost:8000/api/posts`;
        doFetch(url);
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

                        <p>By</p><Link to={`/user/${post.author}`} className="post-author">{post.author}</Link>

                    </div>
                ))}

            </div>
        </>
    );
};

export default PostList;
