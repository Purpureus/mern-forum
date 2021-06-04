import './App.css';
import Home from './Home';
import Header from './Header';
import Post from './Post';
import UserDetails from './UserDetails';
import CreatePost from './CreatePost';
import Login from './Login';
import Signup from './Signup';

import { LoginDataContext } from './LoginDataContext';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
    let storage = window.localStorage;

    // TODO: Implement database and database hooks

    const [loginData, setLoginData] = useState({
        logged: true,
        username: "Admin"
    });
		
		useEffect(() => {
				 const userDatabase = [
						       {
							username: "Admin",
							password: "admin123",
							biography: "admin123",
							userId: 0
						       },
						      ];

				 storage.setItem('user-database', JSON.stringify(userDatabase));
				 const postList = [
						   {
						    id: 0,
						    author: "asdf",
						    title: "Post number 1",
						    content: "Some content.",
						   },
						   {
						    id: 1,
						    author: "asdf",
						    title:
						    "Post number 2 with a really really long title which should overflow the page if it's not well made so let's see what happens",
						    content: "Some content.",
						   },
						  ];

				 storage.setItem('post-storage', JSON.stringify(postList));
				 storage.setItem('login-data', JSON.stringify(loginData));
				 
    }, []);

    return (
        <Router>
            <div className="App">

                <div className="content">
                    <LoginDataContext.Provider value={{loginData, setLoginData}}>
                        <Header></Header>

                        <Switch>

                            <Route exact path="/">
                                <Home />
                            </Route>

                            <Route exact path="/createpost">
                                <CreatePost />
                            </Route>

                            <Route path="/post/:postId">
                                <Post />
                            </Route>

                            <Route path="/user/:requestedUsername">
                                <UserDetails />
                            </Route>

                            <Route path="/login">
                                <Login />
                            </Route>

                            <Route path="/signup">
                                <Signup></Signup>
                            </Route>

                            <Route>Page not found!</Route>

                        </Switch>

                    </LoginDataContext.Provider>
                </div>

            </div>
        </Router>
    );
}

export default App
