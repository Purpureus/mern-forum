import { LoginDataContext } from './LoginDataContext';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

const Login = () => {

    const history = useHistory();
    const [, setLoginData] = useContext(LoginDataContext);

    const [nameField, setNameField] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const storage = window.localStorage;
    const userDatabase = JSON.parse(storage.getItem('user-database'));

    function handleSubmit(e) {
        e.preventDefault();

        let doesUserExist = false;
        let user = null;

        for (let userIndex = 0; userIndex < userDatabase.length; userIndex++) {
            let currentUser = userDatabase[userIndex];
            if (nameField.toLowerCase() === currentUser.username.toLowerCase()) {
                doesUserExist = true;
                user = currentUser;
            }
        }

        if (doesUserExist) {
            const isPasswordCorrect = (passwordField === user.password);

            if (isPasswordCorrect) {
                setLoginData({
                    username: user.username,
                    logged: true
                });
                history.go(-1);
                return;
            }

            setErrorMessage("Incorrect password.");
            return;
        }

        setErrorMessage("Could not find any user with that name.");
        return;
    }

    return (
        <form id="login-form" onSubmit={(e) => handleSubmit(e)}>

            <label htmlFor="username-field">Username</label>
            <input name="username-field" type="text"
                placeholder="Username" required
                value={nameField}
                onChange={(e) => setNameField(e.target.value)} />

            <label htmlFor="pswd-field">Password</label>
            <input name="pswd-field" type="text"
                placeholder="Password" required
                autoComplete="off"
                value={passwordField}
                onChange={(e) => setPasswordField(e.target.value)} />

            <p id="form-error-message">{errorMessage}</p>

            <input type="submit" readOnly value="Submit" />

        </form>
    );
};

export default Login;
