import { createContext, useContext, useState } from "react";

const ServerContext = createContext();

export function useServer(id) {

    const { host, cache, setCache, cachedFetch } = useContext(ServerContext)

    return {
        host,
        cache: cache()[id],
        setCache: (data) => {
            setCache({
                ...cache(),
                [id]: data
            })
        },
        cachedFetch: (options={}, force=false) => {
            return cachedFetch(id, options, force)
        }
    };
}

export function ServerProvider({ children, host }) {

    const [cache, setCache] = useState({});

    function getCache() {
        return cache;
    }

    function request(id, options, force=false) {
        return new Promise(async (resolve, reject) => {
            
            if(cache[id] && !force) return resolve(cache[id]);

            const response = await fetch(`${host}${id || ''}`, options)
            // check if request failed
            if(!response.ok) return reject(new Error(response.statusText));
            var data;
            // check if response is json
            if(response.headers.get('content-type') === 'application/json') data = await response.json();
            else data = await response.text();

            setCache({
                ...cache,
                [id]: data
            })

            return resolve(data)
        })
    }

    return (
        <ServerContext.Provider value={{
            host,
            cache: getCache,
            setCache,
            cachedFetch: request
        }}>
            {children}
        </ServerContext.Provider>
    );
}