import PostList from "./PostList";

const Home = (props) => {
    
    return (
        <div className="main-board">
            <PostList postList={props.postList} />
        </div>
    );
};

export default Home;
