import { useRef, useState } from "react";

// When it's used for props, it only returns the value, not value plus setter
function useStateAsync (value, isProp = false) {
    const ref = useRef(value);
    const [, forceRender] = useState(false);

    function updateState (newState) {
        if (!Object.is(ref.current, newState)) {
            ref.current = newState;
            forceRender(s => !s);
        }
    }

    if (isProp) {
        ref.current = value;
        return ref;
    }

    return [ref, updateState];
}

export default useStateAsync