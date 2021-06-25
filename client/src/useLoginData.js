import { useState, useCallback } from 'react';

export default function useLoginData() {
	const [loginDataMemory, setLoginDataMemory] = useState(JSON.parse(
		window.localStorage.getItem('login-data')
		|| `[{"logged":"false", "username":"null", "accessToken":"null"}]`
	));

	// Data should be received in parsed JSON format
	const setLoginData = useCallback((data) => {
		window.localStorage.setItem('login-data', JSON.stringify(data));
		setLoginDataMemory(data);
	}, []);

	const logOut = useCallback(() => {
		const defaultData = {
			logged: false,
			username: null,
			accessToken: null
		};
		window.localStorage.setItem('login-data', JSON.stringify(defaultData));
		setLoginDataMemory(defaultData);
	}, []);

	return [loginDataMemory, setLoginData, logOut];
};