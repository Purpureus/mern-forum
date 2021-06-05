import { useState } from 'react';

export default function useLogin() {
	const [loginData, setLoginData] = useState();



	return [loginData, setLoginData];
};