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

	return [loginDataMemory, setLoginData];
};