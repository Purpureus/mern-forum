import { createContext } from 'react';

export const LoginDataContext = createContext({
    logged: false,
    username: "guest"
});
