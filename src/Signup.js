import { LoginDataContext } from './LoginDataContext'
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

const Signup = () => {

    const storage = window.localStorage;
    const { loginData, setLoginData } = useContext(LoginDataContext);
    const history = useHistory();

    const [nameField, setNameField] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [repeatPasswordField, setRepeatPasswordField] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleSubmit(e) {
	e.preventDefault();

	if(passwordField == repeatPasswordField) {
	    let newUserDatabase = JSON.parse(storage.getItem('user-database'));
	    
	    newUserDatabase.push({
		username: nameField,
		password: passwordField,
		userId: newUserDatabase.length,
		biography: "jaja"
	    });

	    storage.setItem('user-database', JSON.stringify(newUserDatabase));
	    console.log(storage.getItem('user-database'));
	    
	    setLoginData({
		username: nameField,
		logged: true
	    });

	    history.push("/");
	}

	setErrorMessage("Passwords do not match.");
	return;
    }

    return (
        <form id="signup-form" onSubmit={(e) => handleSubmit(e)}>

            <label htmlFor="username-field">Username</label>
            <input name="username-field" type="text" placeholder="Username"
		   required value={nameField}
		   onChange={(e) => setNameField(e.target.value)}/>

            <label htmlFor="pswd-field">Password</label>
            <input name="pswd-field" type="text" placeholder="Password" autoComplete="off"
		   required value={passwordField}
		   onChange={(e) => setPasswordField(e.target.value)}/>

	    <label htmlFor="repeat-pswd-field">Repeat password</label>
            <input name="repeat-pswd-field" type="text" placeholder="Repeat password" autoComplete="off"
		   required value={repeatPasswordField}
		   onChange={(e) => setRepeatPasswordField(e.target.value)}/>

	    <p id="form-error-message">{ errorMessage }</p>

            <input type="submit" readOnly value="Submit"/>

        </form>
    );
}

export default Signup;
