import { LoginDataContext } from './LoginDataContext';
import usePosts from './usePosts';
import { Link } from 'react-router-dom';
import { useContext } from 'react';

const PostList = () => {

    const [loginData] = useContext(LoginDataContext);
    const [posts] = usePosts();

    return (
        <div className="post-list">

            <div className="item post-list-controls">
                <button>Sort by title &darr;</button>

                <div className="flex-separator"></div>

                {loginData.logged && <Link to="/createpost" className="link">Create post</Link>}
            </div>

            {posts && posts.map((post) => (
                <div className="post item" key={post.id}>

                    <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>

                    <div className="flex-separator"></div>

                    <p>By</p>
                    <Link to={`/user/${post.author}`} className="post-author">{post.author}</Link>

                </div>
            ))}

        </div>
    );
};

export default PostList;
