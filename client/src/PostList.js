import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import useFetch from './useFetch';
import LoginDataContext from './LoginDataContext';

const PostList = () => {

    const [doFetch, fetchLoading, fetchError, posts] = useFetch();
    const [loginData] = useContext(LoginDataContext);
    const history = useHistory();

    useEffect(() => {
        const url = `http://localhost:8000/api/posts`;
        doFetch(url);
    }, [doFetch]);

    const [postOrder, setPostOrder] = useState('date');
    const [postOrderDirection, setPostOrderDirection] = useState('ascending');

    useEffect(() => {
        if (!posts) return;

        if (postOrder === 'date') {
            if (postOrderDirection === 'ascending') {
                posts.sort((postA, postB) => {
                    const dateA = new Date(`${postA.date[2]}-${postA.date[0]}-${postA.date[1]}`);
                    const dateB = new Date(`${postB.date[2]}-${postB.date[0]}-${postB.date[1]}`);
                    return dateB - dateA;
                });
                console.log(posts);
            }
            else if (postOrderDirection === 'descending') {
                posts.sort((postA, postB) => {
                    const dateA = new Date(`${postA.date[2]}-${postA.date[0]}-${postA.date[1]}`);
                    const dateB = new Date(`${postB.date[2]}-${postB.date[0]}-${postB.date[1]}`);
                    return dateA - dateB;
                });
                console.log(posts);
            }
        }
        else if (postOrder === 'title') {
            if (postOrderDirection === 'ascending') {
                posts.sort((postA, postB) => {
                    return postA.title.toLowerCase() < postB.title.toLowerCase();
                });
                console.log(posts);
            }
            else if (postOrderDirection === 'descending') {
                posts.sort((postA, postB) => {
                    return postA.title.toLowerCase() > postB.title.toLowerCase();
                });
                console.log(posts);
            }
        }
    }, [posts, postOrder, postOrderDirection]);

    return (
        <>
            { fetchError && <p className="error">An error occurred: {fetchError}</p>}
            { fetchLoading && <p>Loading posts...</p>}

            <div className="post-list">

                <div className="item post-list-options">

                    <div className="group">
                        <p>Sort by</p>
                        <select id="sort-by"
                            onChange={(e) => setPostOrder(e.target.value)}>
                            <option value="date">date</option>
                            <option value="title">title</option>
                        </select>
                    </div>

                    <select id="sort-direction"
                        onChange={(e) => setPostOrderDirection(e.target.value)}>
                        <option value="ascending">ascending</option>
                        <option value="descending">descending</option>
                    </select>

                    {loginData.logged &&
                        <Link to="/createpost" className="link" id="create-post">Create post</Link>
                    }
                </div>

                {posts && posts.sort().map((post, postIndex) => (
                    <div className="post item" key={postIndex}
                        onClick={(e) => history.push(`/post/${post.postId}`)}
                    >

                        <div className="post-date">
                            {post.date &&
                                <p> {post.date[0]}/{post.date[1]}/{post.date[2]} </p>
                            }
                        </div>

                        <p className="post-title">
                            {post.title}
                        </p>

                        <div className="post-author">
                            <p>By</p>
                            <Link className="" to={`/user/${post.author}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}>
                                {post.author}
                            </Link>
                        </div>

                    </div>
                ))}

            </div>
        </>
    );
};

export default PostList;
