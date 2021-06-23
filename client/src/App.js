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

    useEffect(() => {
        const storage = window.localStorage;
        let loginData = storage.getItem('login-data') || JSON.stringify({
            logged: false,
            username: null,
            accessToken: null
        });
        storage.setItem('login-data', loginData);
    }, []);

    return (
        <Router>
            <div className="App">

                <div className="content">
                    {/* <LoginDataContext.Provider value={[loginData, setLoginData]}> */}
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

                        <Route path="/404">
                            404: Not found
                            </Route>

                        <Route>Page not found!</Route>

                    </Switch>

                    {/* </LoginDataContext.Provider> */}
                </div>

            </div>
        </Router>
    );
}

export default App;
