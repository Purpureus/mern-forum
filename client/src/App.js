import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Header from './Header';
import Post from './Post';
import UserDetails from './UserDetails';
import CreatePost from './CreatePost';
import EditPost from './EditPost';
import Login from './Login';
import Signup from './Signup';
import LoginDataContext from './LoginDataContext';
import useLoginData from './useLoginData';
import useFetch from './useFetch';

function App() {

    const [loginData, setLoginData, logOut] = useLoginData();
    const [doFetch] = useFetch();

    useEffect(() => {
        if (!loginData.accessToken) return;
        const url = `http://localhost:8000/verifyToken`;
        const options = {
            headers: {
                'Authorization': `Bearer: ${loginData.accessToken}`
            }
        };
        doFetch(url, options, data => {
            data.accessTokenValid || logOut();
        });
    }, [doFetch, loginData.accessToken, logOut]);

    return (
        <Router>
            <div className="App">

                <div className="content">
                    <LoginDataContext.Provider value={[loginData, setLoginData, logOut]}>
                        <Header></Header>

                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>

                            <Route exact path="/createpost">
                                <CreatePost />
                            </Route>

                            <Route path="/post/:postId/edit">
                                <EditPost />
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
                                <Signup />
                            </Route>

                            <Route path="/404">
                                404: Not found
                            </Route>

                            <Route>Page not found!</Route>
                        </Switch>
                    </LoginDataContext.Provider>
                </div>

            </div>
        </Router >
    );
}

export default App;
