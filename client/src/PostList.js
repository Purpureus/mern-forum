import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import useFetch from './useFetch';
import LoginDataContext from './LoginDataContext';

const PostList = () => {

    const [doFetch, fetchLoading, fetchError] = useFetch();
    const [loginData] = useContext(LoginDataContext);
    const history = useHistory();

    const [posts, setPosts] = useState(null);
    // const [postOrder, setPostOrder] = useState('date');
    // const [postOrderDirection, setPostOrderDirection] = useState('ascending');
    const [page, setPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const postsPerPage = 10;

    // NOTE: we define a trigger to sort the posts in order to solve reference equality issues.
    // const [sortPostsQueued, setSortPostsQueued] = useState(false);

    useEffect(() => {
        const from = postsPerPage * (page - 1);
        const to = postsPerPage * page;
        const url = `http://localhost:8000/api/posts?from=${from}&to=${to}`;
        doFetch(url, {}, (data, error) => {
            if (error || !data) return;
            setPosts(data.posts);
            setNumberOfPages(data.numberOfPages);
        });
    }, [doFetch, page]);

    // const sortPosts = () => {
    //     const order = `${postOrder} ${postOrderDirection}`;
    //     const sortedPosts = [...posts];

    //     switch (order) {
    //         case 'date ascending':
    //             sortedPosts.sort((postA, postB) => new Date(postA.date) - new Date(postB.date));
    //             break;

    //         case 'date descending':
    //             sortedPosts.sort((postA, postB) => new Date(postB.date) - new Date(postA.date));
    //             break;

    //         case 'title ascending':
    //             sortedPosts.sort((postA, postB) => postA.title.localeCompare(postB.title));
    //             break;

    //         case 'title descending':
    //             sortedPosts.sort((postA, postB) => postB.title.localeCompare(postA.title));
    //             break;

    //         default:
    //     }

    //     setPosts(sortedPosts);
    // };

    // useEffect(() => {
    //     setSortPostsQueued(true);
    // }, [postOrder, postOrderDirection, setSortPostsQueued]);

    // if (posts && posts.length > 0 && sortPostsQueued) {
    //     sortPosts();
    //     setSortPostsQueued(false);
    // }

    // const postListOptions = (
    //     <div className="item post-list-options">
    //         <div className="group">
    //             <p>Sort by</p>
    //             <select id="sort-by"
    //                 value={postOrder}
    //                 onChange={(e) => setPostOrder(e.target.value)}>
    //                 <option value='date'>date</option>
    //                 <option value='title'>title</option>
    //             </select>
    //         </div>

    //         <select id="sort-direction"
    //             value={postOrderDirection}
    //             onChange={(e) => setPostOrderDirection(e.target.value)}>
    //             <option value='ascending'>ascending</option>
    //             <option value='descending'>descending</option>
    //         </select>
    //     </div>
    // );

    const pageButtons = [];
    const minCap = Math.min(Math.max(0, page - 3), Math.max(0, numberOfPages - 5));
    const maxCap = Math.max(Math.min(numberOfPages, page + 2), Math.min(5, numberOfPages));
    for (let i = minCap; i < maxCap; i++) {
        pageButtons.push(i + 1);
    }

    const pageOptions = (
        <div className="item page-controls">
            <p>Page</p>
            <button className={`page-button ${page <= 1 && 'disabled'}`}
                onClick={() => (page > 1) && setPage(page - 1)}>
                &larr;
            </button>

            {pageButtons && pageButtons.map((button, buttonIndex) => (
                <button key={buttonIndex}
                    className={`page-button ${button === page && 'current'}`}
                    onClick={(e) => setPage(button)}>{button}</button>
            ))
            }

            <button className={`page-button ${page >= numberOfPages && 'disabled'}`}
                onClick={() => setPage(page + 1)}>&rarr;</button>

            {loginData.logged &&
                <Link to="/createpost" className="link create-post">Create post</Link>
            }
        </div >
    );

    return (
        <>
            { fetchError && <p className="error">An error occurred: {fetchError}</p>}
            { fetchLoading && <p>Loading posts...</p>}

            <div className="post-list">

                {/* {postListOptions} */}
                {pageOptions}

                {(posts && posts.length > 0) ||
                    <div className="item">No posts to be displayed</div>
                }

                {posts && Array.isArray(posts) && posts.map((post, postIndex) => (
                    <div className={`post item ${post.pinned ? 'pinned' : ''}`} key={postIndex}
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

                        {post.pinned &&
                            <p className="pinned-post-tag"><i>{`PINNED`}</i></p>
                        }
                        <p className="post-title">
                            {post.title}
                        </p>

                        <div className="post-author">
                            By {post.author}
                        </div>

                    </div>
                ))}

                {pageOptions}
                {/* {postListOptions} */}

            </div>
        </>
    );
};

export default PostList;
