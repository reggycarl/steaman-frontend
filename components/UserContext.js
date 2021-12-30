import { createContext } from 'react';
const UserContext = createContext(true);
export const Provider = UserContext.Provider;

export default UserContext;