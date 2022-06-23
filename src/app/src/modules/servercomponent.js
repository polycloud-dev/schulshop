import { createContext, useContext } from "react";

const ServerContext = createContext();

export function useServer() {
    return useContext(ServerContext);
}

export function ServerProvider({ children, host }) {
    return (
        <ServerContext.Provider value={{
            host
        }}>
            {children}
        </ServerContext.Provider>
    );
}