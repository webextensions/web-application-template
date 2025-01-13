import { useRef, useLayoutEffect, useEffect } from 'react';

import { debounce } from 'throttle-debounce';

// `useMinHeight` remembers the height of the last render and saves it in `localStorage`.
// Utilize the `ref` to enure `min-height` is applied to the element.
// The `key` parameter is used to differentiate between different elements.
const useMinHeight = function ({
    ref,
    key,
    baseKey = 'useMinHeight-',
    timeout = 5000,
    removeMinHeightTimeout = 350
}) {
    if (!ref) {
        ref = useRef(null); // eslint-disable-line react-hooks/rules-of-hooks
    }

    const computedKey = baseKey + key;

    const heightFromLastRender = localStorage.getItem(computedKey) || '0';

    const removeMinHeightImmediately = () => {
        if (ref.current) {
            ref.current.style.minHeight = ''; // Remove min-height
        }
    };

    const removeMinHeight = () => {
        // Removing min-height after a timeout to give the element some time to render properly (in case there is some
        // more activity/complexity is going on).
        setTimeout(removeMinHeightImmediately, removeMinHeightTimeout);
    };

    if (timeout) {
        // Removing min-height after a timeout.
        // The `timeout` parameter has a default value as well in case someone doesn't pass a value for it and utilizes
        // this function without understanding potential side-effects of some combinations of the parameters for the
        // functionality.
        setTimeout(removeMinHeightImmediately, timeout);
    }

    // Debounce the saving of the height to localStorage
    const debounceFunc = debounce(350, (newHeight) => {
        localStorage.setItem(computedKey, String(newHeight));
    });

    // Observe height change for the DOM element and save it in localStorage when the height changes
    const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const el = entry.target;

        // // NOTE: The following 3 approaches give different values for the height. Approach 3 is the most accurate one
        // //       from `min-height` perspective.
        // //       The example values are from a specific browser for a specific case for an element's height of 107px
        // //       with zoom level of 90% and the exact values may vary for different conditions.
        // const newHeight = el.offsetHeight;                // Approach 1 - example value 107
        // const newHeight = entry.contentRect.height;       // Approach 2 - example value 106.65625
        const newHeight = el.getBoundingClientRect().height; // Approach 3 - example value 106.66667175292969
        debounceFunc(newHeight);
    });

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.style.minHeight = heightFromLastRender + 'px';
        }
    });

    useEffect(() => {
        const refCurrent = ref.current;
        if (refCurrent) {
            observer.observe(refCurrent);
        }
        return () => {
            if (refCurrent) {
                observer.unobserve(refCurrent);
            }
        };
    });

    return {
        ref,
        heightFromLastRender,
        removeMinHeight,
        removeMinHeightImmediately
    };
};

export { useMinHeight };
