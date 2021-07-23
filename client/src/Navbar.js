import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import LoginDataContext from './LoginDataContext';

const Navbar = () => {

    const history = useHistory();
    const [loginData, setLoginData] = useContext(LoginDataContext);;

    function logOut() {
        setLoginData({
            logged: false,
            username: null,
            accessToken: null
        });

        history.go(-1);
    }

    return (
        <nav>

            <Link className="nav-button" to="/">Home</Link>

            <div className="flex-separator"></div>

            { loginData && loginData.logged
                ? <p>Logged as {loginData.username}</p>
                : <p>[Not logged in]</p>
            }

            { loginData && loginData.logged
                ? <Link className="nav-button" to="/" onClick={logOut}>Log out</Link>
                : <Link className="nav-button" to="/login">Log in</Link>
            }

            { (loginData && loginData.logged) ||
                <Link className="nav-button" to="/signup">Sign up</Link>
            }

        </nav>
    );
};

export default Navbar;
