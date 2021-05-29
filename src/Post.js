import { useParams, Link } from 'react-router-dom';

const Post = () => {
    const { postId } = useParams();

    const storage = window.localStorage;
    const post = JSON.parse(storage.getItem('post-storage'))[postId];

    return (
	<div className="post">
	    <h1 className="postTitle">
		{ post.title }
	    </h1>
	    
	    <Link className="postAuthor" to={`/user/${post.author}`}>
		By { post.author }
	    </Link>

	    <p className="postContent">
		{ post.content }
	    </p>
        </div>
    );
};

export default Post;
