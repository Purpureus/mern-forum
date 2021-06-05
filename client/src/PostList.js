import { LoginDataContext } from './LoginDataContext';
import { Link } from 'react-router-dom';
import { useContext } from 'react';

const PostList = () => {

    const [loginData] = useContext(LoginDataContext);

    const storage = window.localStorage;
    const postList = JSON.parse(storage.getItem('post-storage'));

    // const postList = fetch('');

    return (
        <div className="post-list">

            <div className="item post-list-controls">
                <button>Sort by title &darr;</button>

                <div className="flex-separator"></div>

                {loginData.logged && <Link to="/createpost" className="link">Create post</Link>}
            </div>

            { postList.map((post) => (
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