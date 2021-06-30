import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import useFetch from './useFetch';

import LoginDataContext from './LoginDataContext';

const Login = () => {

    const history = useHistory();

    const [nameField, setNameField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const [doFetch, fetchLoading, fetchError] = useFetch();
    const [, setLoginData] = useContext(LoginDataContext);

    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        const url = `http://localhost:8000/login`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: nameField,
                password: passwordField
            })
        };

        doFetch(url, options, (data, error = null) => {
            if (error) return;

            const newLoginData = {
                logged: true,
                username: data.username,
                accessToken: data.accessToken
            };
            setLoginData(newLoginData);

            history.go(-1);
        });
    }

    return (
        <>
            <form id="login-form" onSubmit={(e) => handleSubmit(e)}>

                <label htmlFor="username-field">Username</label>
                <input required type="text"
                    name="username-field" id="username-field"
                    placeholder="Username"
                    value={nameField}
                    onChange={(e) => setNameField(e.target.value)} />

                <label htmlFor="pswd-field">Password</label>
                <input required
                    type={showPassword ? "text" : "password"}
                    name="pswd-field" id="pswd-field"
                    placeholder="Password"
                    autoComplete="off"
                    value={passwordField}
                    onChange={(e) => setPasswordField(e.target.value)} />

                <div id="toggle-view-pswd-container">
                    <input name="toggle-view-pswd" type="checkbox" id="toggle-view-pswd"
                        onChange={(e) => setShowPassword(e.target.checked)} />
                    <label htmlFor="toggle-view-pswd">Show password</label>
                </div>

                {fetchError &&
                    <p id="form-error-message">{fetchError.error}</p>
                }

                <input type="submit" readOnly value={
                    fetchLoading ? "Loading..." : "Submit"
                } />

            </form>
        </>
    );
};

export default Login;
