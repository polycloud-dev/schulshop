import { useServer } from "../modules/servercomponent";
import { useState, useEffect } from "react";

export default function ServerComponent({ children, result, error, loading, onFailed, path }) {

    if(children && typeof children !== 'function') throw new Error("ServerComponent does not accept children");
    
    if(!children && (!result || typeof result !== "function")) throw new Error("ServerComponent requires a result function");
    
    if(!onFailed || typeof onFailed !== "function") onFailed = (_, retries) => {
        if(retries < 3) return 'retry'
        return 'abort'
    };

    const { host } = useServer()

    const [cachedData, setCachedData] = useState(null);
    const [state, setState] = useState({
        state: 'loading',
        data: null,
        error: null
    });

    const fetchData = async (tries=0) => {
        setState({
            state: 'loading',
            data: null,
            error: null
        })
        try {
            const response = await fetch(`${host}${path || ''}`);
            // check if request failed
            if(!response.ok) {
                throw new Error(response.statusText);
            }
            var data;
            // check if response is json
            if(response.headers.get('content-type') === 'application/json') data = await response.json();
            else data = await response.text();
            setCachedData(data);
            setState({
                data,
                error: null,
                state: 'success'
            });
        }catch(error) {
            const action = onFailed(error, tries);
            if(action === 'retry') await fetchData(tries+1);
            else if(action === 'ignore' && cachedData) setState({
                data: cachedData,
                error: null,
                state: 'success',
            })
            else setState({
                data: null,
                error: error.message,
                state: 'error',
            })
        }
    }

    useEffect(() => {
        fetchData();
    }, [host]);

    if(state.state === 'success') return result(state.data);
    else if(state.state === 'error') {
        if(typeof error === 'function') return error(state.error);
        else if(error) return error;
    }
    else if(state.state === 'loading') {
        if(typeof loading === 'function') return loading();
        else if(loading) return loading;
    }

    return <></>
}

/*
    Does not accept children as a prop.
    Does accept 'result' only as a function
    Does accept 'error' as a function or Component or undefined
    Does accept 'loading' as a Component or undefined
    'onFailed' is a function to handle errors. params -> error, retries; returns -> 'retry', 'ignore', 'abort'
*/