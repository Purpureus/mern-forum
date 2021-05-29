import { createContext } from 'react';

export const LoginDataContext = createContext({
    username: "not_logged",
    logged: false
});
