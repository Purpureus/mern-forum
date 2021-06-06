import { LoginDataContext } from './LoginDataContext';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import usePosts from './usePosts';

const CreatePost = () => {

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [loginData] = useContext(LoginDataContext);
    const history = useHistory();
    const [posts, setPosts] = usePosts();

    function submitPost(e) {
        e.preventDefault();

        fetch(`http://localhost:8000/api/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: postTitle,
                content: postContent
            })
        })
            .then(res => res.json())
            .then(posts => {
                setPosts(posts);
                return (history.go(-1));
            });
    }

    return (
        <>
            {loginData.logged
                ? <form onSubmit={submitPost}>

                    <h1>Create post</h1>

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

                    <input name="post-submit" type="submit" value="Submit post" />

                </form>
                : <div className="error">
                    You're not logged in. Please <Link to="/login" className="link painted">log in </Link> to continue.
               </div>}
        </>
    );
};

export default CreatePost;
