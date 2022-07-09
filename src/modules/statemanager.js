import { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export default function useSafeState(id) {
    
    const [state, setState] = useContext(StateContext);

    return [
        state[id],
        (newState) => {
            setState({
                ...state,
                [id]: newState
            });
        }
    ]
}

export function StateProvider({ children }) {
    const [state, setState] = useState({});
    return (
        <StateContext.Provider value={[state, setState]}>
            {children}
        </StateContext.Provider>
    )
}