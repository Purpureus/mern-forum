import { LoginDataContext } from './LoginDataContext';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CreatePost = () => {

    const { loginData } = useContext(LoginDataContext);

    const history = useHistory();
    const forumStorage = window.localStorage;

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");

    function submitPost(e) {
        e.preventDefault();

        let blogPosts = JSON.parse(forumStorage.getItem('post-storage'));
        blogPosts.push({
            title: postTitle,
            content: postContent,
            author: loginData.username,
            id: blogPosts.length
        });

        history.go(-1);

        forumStorage.setItem('post-storage', JSON.stringify(blogPosts));
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
                          onChange={(e) => setPostTitle(e.target.value)}/>

                   <label htmlFor="post-content">Post content</label>
                   <textarea rows="10" cols="30" required max="999"
                             id="post-content"
                             placeholder="Content"
                             value={postContent}
                             onChange={(e) => setPostContent(e.target.value)}
                             name="post-content"></textarea>

                   <input name="post-submit" type="submit" value="Submit post"/>

               </form>
             : <div className="error">
                   You're not logged in. Please <Link to="/login" className="link painted">log in </Link> to continue.
               </div>}
        </>
    );
};

export default CreatePost;
