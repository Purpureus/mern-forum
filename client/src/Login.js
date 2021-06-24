import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import useFetch from './useFetch';
import { LoginDataContext } from './LoginDataContext';

const Login = () => {

    const history = useHistory();

    const [nameField, setNameField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const [doFetch, fetchLoading, fetchError] = useFetch();
    const [, setLoginData] = useContext(LoginDataContext);

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

                <p id="form-error-message">{fetchError}</p>

                <input type="submit" readOnly value={
                    fetchLoading ? "Loading..." : "Submit"
                } />

            </form>
        </>
    );
};

export default Login;
