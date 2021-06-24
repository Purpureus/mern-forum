import { createContext } from 'react';

export const LoginDataContext = createContext(JSON.parse(
    window.localStorage.getItem('login-data')
    || `[{"logged":"false", "username":"null", "accessToken":"null"}]`
));
