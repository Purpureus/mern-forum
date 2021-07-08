import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useFetch from './useFetch';

const Signup = () => {

	const history = useHistory();

	const [nameField, setNameField] = useState('');
	const [passwordField, setPasswordField] = useState('');
	const [repeatPasswordField, setRepeatPasswordField] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [doFetch, fetchLoading, fetchError] = useFetch();

	function handleSubmit(e) {
		e.preventDefault();

		if (passwordField !== repeatPasswordField) {
			setErrorMessage("Passwords do not match.");
			return;
		}
		const url = `http://localhost:8000/signup`;
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

			history.push("/");
		});
	}

	return (
		<form id="signup-form" onSubmit={(e) => handleSubmit(e)}>

			<label htmlFor="username-field">Username</label>
			<input name="username-field" id="username-field" type="text"
				placeholder="Username"
				required value={nameField}
				onChange={(e) => setNameField(e.target.value)} />
			<p class="field-char-count"
				value={nameField}></p>

			<label htmlFor="pswd-field">Password</label>
			<input name="pswd-field" id="pswd-field" type="password" placeholder="Password" autoComplete="off"
				required value={passwordField}
				onChange={(e) => setPasswordField(e.target.value)} />

			<label htmlFor="repeat-pswd-field">Repeat password</label>
			<input name="repeat-pswd-field" type="password" placeholder="Repeat password" autoComplete="off"
				required value={repeatPasswordField}
				onChange={(e) => setRepeatPasswordField(e.target.value)} />

			<p id="form-error-message">{errorMessage} {fetchError && fetchError.error}</p>

			<input type="submit" readOnly
				value={fetchLoading ? "Submitting..." : "Submit"} />

		</form>
	);
}

export default Signup;
