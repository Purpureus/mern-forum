import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import useFetch from './useFetch';
import LoginDataContext from './LoginDataContext';

const PostList = () => {

    const [doFetch, fetchLoading, fetchError] = useFetch();
    const [loginData] = useContext(LoginDataContext);
    const history = useHistory();

    const [posts, setPosts] = useState(null);
    const [postOrder, setPostOrder] = useState('date');
    const [postOrderDirection, setPostOrderDirection] = useState('ascending');

    // NOTE: we define a trigger to sort the posts in order to solve reference equality issues.
    const [sortPostsQueued, setSortPostsQueued] = useState(false);

    useEffect(() => {
        const url = `http://localhost:8000/api/posts`;
        doFetch(url, {}, (data, error) => {
            if (error || !data) return;
            setPosts(data);
        });
    }, [doFetch]);

    const sortPosts = () => {
        const order = `${postOrder} ${postOrderDirection}`;
        const sortedPosts = [...posts];

        console.log(`Sorting...`);

        switch (order) {
            case 'date ascending':
                sortedPosts.sort((postA, postB) => new Date(postA.date - postB.date));
                break;

            case 'date descending':
                sortedPosts.sort((postA, postB) => new Date(postB.date - postA.date));
                break;

            case 'title ascending':
                sortedPosts.sort((postA, postB) => postA.title.localeCompare(postB.title));
                break;

            case 'title descending':
                sortedPosts.sort((postA, postB) => postB.title.localeCompare(postA.title));
                break;

            default:
        }

        setPosts(sortedPosts);
    };

    useEffect(() => {
        setSortPostsQueued(true);
    }, [postOrder, postOrderDirection, setSortPostsQueued]);

    if (posts && posts.length > 0 && sortPostsQueued) {
        sortPosts();
        setSortPostsQueued(false);
    }

    const postListOptions = (
        <div className="item post-list-options">
            <div className="group">
                <p>Sort by</p>
                <select id="sort-by"
                    value={postOrder}
                    onChange={(e) => setPostOrder(e.target.value)}>
                    <option value='date'>date</option>
                    <option value='title'>title</option>
                </select>
            </div>

            <select id="sort-direction"
                value={postOrderDirection}
                onChange={(e) => setPostOrderDirection(e.target.value)}>
                <option value='ascending'>ascending</option>
                <option value='descending'>descending</option>
            </select>

            {loginData.logged &&
                <Link to="/createpost" className="link create-post">Create post</Link>
            }
        </div>
    );

    return (
        <>
            { fetchError && <p className="error">An error occurred: {fetchError}</p>}
            { fetchLoading && <p>Loading posts...</p>}

            <div className="post-list">

                {postListOptions}

                {(posts && posts.length > 0) ||
                    <div className="item">No posts to be displayed</div>
                }

                {posts && posts.sort().map((post, postIndex) => (
                    <div className="post item" key={postIndex}
                        onClick={() => history.push(`/post/${post.postId}`)}>

                        <div className="post-date">
                            {post.date &&
                                <>
                                    <p>
                                        {post.date.slice(0, 4)}/
                                        {post.date.slice(5, 7)}/
                                        {post.date.slice(8, 10)}
                                    </p>
                                    <p>
                                        at {post.date.slice(11, 19)}
                                    </p>
                                </>
                            }
                        </div>

                        <p className="post-title">
                            {post.title}
                        </p>

                        <div className="post-author">
                            <p>By</p>
                            <Link className="" to={`/user/${post.author}`}
                                onClick={(e) => e.stopPropagation()}>
                                {post.author}
                            </Link>
                        </div>

                    </div>
                ))}

                {postListOptions}

            </div>
        </>
    );
};

export default PostList;
