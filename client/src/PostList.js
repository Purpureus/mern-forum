import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import useFetch from './useFetch';
import LoginDataContext from './LoginDataContext';

const PostList = () => {

    const [doFetch, fetchLoading, fetchError, posts] = useFetch();
    const [loginData] = useContext(LoginDataContext);

    useEffect(() => {
        const url = `http://localhost:8000/api/posts`;
        doFetch(url);
    }, [doFetch]);

    const [postOrder, setPostOrder] = useState('date');
    const [postOrderDirection, setPostOrderDirection] = useState('ascending');

    useEffect(() => {
        if (!posts) return;

        console.log(`${postOrder} ${postOrderDirection}`);

        switch (postOrder) {
            case 'date':
                posts.sort((postA, postB) => {
                    const dateA = new Date(`${postA.date[2]}-${postA.date[0]}-${postA.date[1]}`);
                    const dateB = new Date(`${postB.date[2]}-${postB.date[0]}-${postB.date[1]}`);
                    return (postOrderDirection === 'ascending')
                        ? (dateB - dateA)
                        : (dateA - dateB);
                });
                break;

            case 'title':
                posts.sort((postA, postB) => {
                    return (postOrderDirection === 'ascending')
                        ? postA.title.toLowerCase() < postB.title.toLowerCase()
                        : postA.title.toLowerCase() > postB.title.toLowerCase();
                });
                break;
        }
    }, [posts, postOrder, postOrderDirection]);

    return (
        <>
            { fetchError && <p className="error">An error occurred: {fetchError}</p>}
            { fetchLoading && <p>Loading posts...</p>}

            <div className="post-list">

                <div className="item post-list-controls">
                    <select id="sort-by"
                        onChange={(e) => setPostOrder(e.target.value)}>
                        <option value="date">Sort by date</option>
                        <option value="title">Sort by title</option>
                    </select>

                    <select id="sort-direction"
                        onChange={(e) => setPostOrderDirection(e.target.value)}>
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>

                    {loginData.logged
                        ? <Link to="/createpost" className="link">Create post</Link>
                        : <div></div>
                    }
                </div>

                {posts && posts.sort().map((post, postIndex) => (
                    <div className="post item" key={postIndex}>

                        <div className="date">
                            {post.date &&
                                <p> {post.date[0]}/{post.date[1]}/{post.date[2]} </p>
                            }
                        </div>

                        <Link className="post-title" to={`/post/${post.postId}`}>
                            {post.title}
                        </Link>

                        <div>
                            <p>By</p>
                            <Link className="post-author" to={`/user/${post.author}`}>
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
