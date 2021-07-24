import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import useFetch from './useFetch';
import LoginDataContext from './LoginDataContext';

const PostList = () => {

    const [doFetch] = useFetch();
    const [postFetchLoading, setPostFetchLoading] = useState(false);
    const [postFetchError, setPostFetchError] = useState(null);
    const [loginData] = useContext(LoginDataContext);
    const history = useHistory();

    const [posts, setPosts] = useState(null);
    const [page, setPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(1);
    const postsPerPage = 10;

    const [searchField, setSearchField] = useState("");

    useEffect(() => {
        const from = postsPerPage * (page - 1);
        const to = postsPerPage * page;
        const url = `http://localhost:8000/api/posts?from=${from}&to=${to}`;
        doFetch(url, {}, (data, error) => {
            setPostFetchError(error);
            setPostFetchLoading(false);
            if (error || !data) return;
            setPosts(data.posts);
            setNumberOfPages(data.numberOfPages);
        });
    }, [doFetch, page]);

    function searchPost(e) {
        e.preventDefault();

        const from = postsPerPage * (page - 1);
        const to = postsPerPage * page;
        const url = `http://localhost:8000/api/posts/search?q=${searchField}&from=${from}&to=${to}`;
        doFetch(url, {}, (data, error) => {
            if (error) return console.log(error);
            console.log(data);
        });
    }

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
                    onClick={() => setPage(button)}>{button}</button>
            ))
            }

            <button className={`page-button ${page >= numberOfPages && 'disabled'}`}
                onClick={() => setPage(page + 1)}>&rarr;</button>

            <form className="post-search-form" onSubmit={(e) => searchPost(e)}>
                <input type="text" value={searchField}
                    onChange={(e) => setSearchField(e.target.value)} />
                <input type="submit" value="Search" />
            </form>

            {loginData.logged &&
                <Link to="/createpost" className="link create-post">Create post</Link>
            }

        </div>
    );

    return (
        <>
            { postFetchError && <p className="error">An error occurred: {postFetchError}</p>}
            { postFetchLoading && <p>Loading posts...</p>}

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
