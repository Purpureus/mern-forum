import usePosts from './usePosts';
import { useParams, Link } from 'react-router-dom';

const Post = () => {
	const { postId } = useParams();

	const [posts, , isPending, error] = usePosts();
	if (isPending) {
		return (
			<p className="info">Loading file...</p>
		);
	}
	if (error) {
		return (
			<p className="error">Error: {error}</p>
		);
	}
	if (!posts || !posts[postId]) {
		return (
			<p className="error">The requested post does not exist.</p>
		);
	}
	const post = posts[postId];

	return (
		<div className="post">
			<h1 className="postTitle">
				{post.title}
			</h1>

			<Link className="postAuthor" to={`/user/${post.author}`}>
				By {post.author}
			</Link>

			<p className="postContent">
				{post.content}
			</p>
		</div>
	);
};

export default Post;
