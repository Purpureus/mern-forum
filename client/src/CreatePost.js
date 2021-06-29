import { useState, useEffect, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';

import useFetch from './useFetch';
import { LoginDataContext } from './LoginDataContext';

const CreatePost = () => {

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const history = useHistory();

    const [doFetch, fetchLoading, fetchError] = useFetch();
    const [loginData, , logOut] = useContext(LoginDataContext);

    useEffect(() => {
        if (!fetchError || !fetchError.accessTokenExpired) return;
        logOut();
    }, [fetchError, logOut]);

    function submitPost(e) {
        e.preventDefault();

        const url = `http://localhost:8000/api/posts`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${loginData.accessToken}`
            },
            body: JSON.stringify({
                title: postTitle,
                content: postContent
            })
        };

        doFetch(url, options, (data, error) => {
            if (error) return console.log(`Error submitting the post.`);
            history.go(-1)
        });
    }

    let errorDisplayMessage = null;
    if (fetchError) {
        errorDisplayMessage = fetchError.accessTokenExpired
            ? <>Your session has expired. Please <Link to="/login" className="link painted">
                log in </Link> again.</>
            : <>An error occurred while creating the post: fetchError.error</>
    }

    return (
        <>
            {errorDisplayMessage &&
                <div className="error">{errorDisplayMessage}</div>
            }

            <form onSubmit={submitPost}>

                <h1>Create post</h1>

                <label htmlFor="post-title">Post title</label>
                <input name="post-title" required maxLength="99"
                    placeholder="Title"
                    autoComplete="off"
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)} />

                <label htmlFor="post-content">Post content</label>
                <textarea rows="10" cols="30" required maxLength="999"
                    id="post-content"
                    placeholder="Content"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    name="post-content"></textarea>

                <input name="post-submit" type="submit"
                    value={fetchLoading ? "Submitting..." : "Submit post"} />

            </form>
        </>
    );
};

export default CreatePost;
