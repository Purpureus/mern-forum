import { createContext } from 'react';

const LoginDataContext = createContext(JSON.parse(
    window.localStorage.getItem('login-data')
    || `[{"logged":"false", "username":"null", "accessToken":"null"}]`
));

export default LoginDataContext;