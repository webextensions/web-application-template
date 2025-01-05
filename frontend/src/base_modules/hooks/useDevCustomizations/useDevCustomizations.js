import { useEffect, useLayoutEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

// Setup localStorage based on URL search params only once at the time of load itself
const flagDevHelperMenuOptionFromUrl = (new URLSearchParams(window.location.search)).get('flagDevHelperMenuOption') || 'no';

let loggedOnce = false;

export const useDevCustomizations = function () {
    const [
        flagDevHelperMenuOption,
        setFlagDevHelperMenuOption
    ] = useLocalStorageState('flagDevHelperMenuOption', { defaultValue: flagDevHelperMenuOptionFromUrl });
    useLayoutEffect(() => {
        if (flagDevHelperMenuOptionFromUrl === 'yes') {
            setFlagDevHelperMenuOption('yes');
        }
    }, []);

    const [
        flagDifferentColorHeaderBackground,
        setFlagDifferentColorHeaderBackground
    ] = useLocalStorageState('flagDifferentColorHeaderBackground', { defaultValue: 'no' });

    const [
        flagLinksToHiddenPages,
        setFlagLinksToHiddenPages
    ] = useLocalStorageState('flagLinksToHiddenPages', { defaultValue: 'no' });

    const [
        ajaxRequestTimeout,
        setAjaxRequestTimeout
    ] = useLocalStorageState('ajaxRequestTimeout', { defaultValue: '30000' });

    const flagAnyCustomizationExists = (
        flagDevHelperMenuOption !== 'no' ||
        flagDifferentColorHeaderBackground !== 'no' ||
        flagLinksToHiddenPages !== 'no' ||
        ajaxRequestTimeout !== '30000'
    );
    useEffect(() => {
        if (flagAnyCustomizationExists && !loggedOnce) {
            console.log('Some customizations have been applied via Dev Helper.\nRun `dev()` to update customizations.');
            loggedOnce = true;
        }
    }, []);

    return {
        flagDevHelperMenuOption,
        setFlagDevHelperMenuOption,

        flagDifferentColorHeaderBackground,
        setFlagDifferentColorHeaderBackground,

        flagLinksToHiddenPages,
        setFlagLinksToHiddenPages,

        ajaxRequestTimeout,
        setAjaxRequestTimeout,

        flagAnyCustomizationExists
    };
};
