import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useFetch from './useFetch';

const Signup = () => {

	const maxUsernameLen = 50;
	const maxPasswordLen = 50;

	const history = useHistory();

	const [nameField, setNameField] = useState('');
	const [passwordField, setPasswordField] = useState('');
	const [repeatPasswordField, setRepeatPasswordField] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [submitEnabled, setSubmitEnabled] = useState(false);

	const [doFetch] = useFetch();
	const [signupFetchLoading, setSignupFetchLoading] = useState(false);
	const [signupFetchError, setSignupFetchError] = useState(null);

	useEffect(() => {
		if (!nameField || !passwordField) {
			setErrorMessage(`Please enter username and password`);
			setSubmitEnabled(false);
			return;
		}

		if (nameField) {
			if (nameField.length < 8) {
				setErrorMessage(`Name is too short`);
				setSubmitEnabled(false);
				return;
			}
		}
		if (passwordField) {
			if (passwordField.length < 8) {
				setErrorMessage(`Password is too short`);
				setSubmitEnabled(false);
				return;
			}
			if (passwordField !== repeatPasswordField) {
				setErrorMessage(`Passwords do not match`);
				setSubmitEnabled(false);
				return;
			}
		}

		setErrorMessage(null);
		setSubmitEnabled(true);
	}, [nameField, passwordField, repeatPasswordField]);

	function handleSubmit(e) {
		e.preventDefault();

		if (!submitEnabled) {
			return;
		}

		const url = `${process.env.REACT_APP_SERVER_URL}/signup`;
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

		setSignupFetchLoading(true);
		doFetch(url, options, (data, error) => {
			setSignupFetchError(error);
			setSignupFetchLoading(false);
			if (error) return;
			history.push('/');
		});
	}

	return (
		<form className="default-form" id="signup-form" onSubmit={(e) => handleSubmit(e)}>

			<label htmlFor="username-field">
				Username
				<div className="field-char-count">{nameField.length}/{maxUsernameLen}</div>
			</label>
			<input name="username-field" id="username-field" type="text"
				placeholder="Username" maxLength={maxUsernameLen}
				required value={nameField}
				onChange={(e) => setNameField(e.target.value)} />

			<label htmlFor="pswd-field">
				Password
				<div className="field-char-count">{passwordField.length}/{maxPasswordLen}</div>
			</label>
			<input name="pswd-field" id="pswd-field"
				type="password"
				placeholder="Password"
				autoComplete="off" maxLength={maxPasswordLen}
				required value={passwordField}
				onChange={(e) => setPasswordField(e.target.value)} />

			<label htmlFor="repeat-pswd-field">Repeat password</label>
			<input name="repeat-pswd-field"
				type="password"
				placeholder="Repeat password"
				autoComplete="off"
				required value={repeatPasswordField}
				onChange={(e) => setRepeatPasswordField(e.target.value)} />

			<p id="form-error-message">{errorMessage} {signupFetchError && signupFetchError.message}</p>

			<input type="submit" readOnly
				value={signupFetchLoading ? "Submitting..." : "Submit"}
				className={`${submitEnabled ? '' : 'disabled'}`} />

		</form>
	);
}

export default Signup;
