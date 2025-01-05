import { useEffect } from 'react';

import { useDevCustomizations } from '../../../base_modules/hooks/useDevCustomizations/useDevCustomizations.js';
import { kyForApp } from '../../dal.js';

const DevCustomizationsSetup = function () {
    const { ajaxRequestTimeout } = useDevCustomizations();

    useEffect(() => {
        const ajaxRequestTimeoutInt = Number.parseInt(ajaxRequestTimeout, 10);
        if (
            Number.isNaN(ajaxRequestTimeoutInt) ||
            !ajaxRequestTimeoutInt ||
            ajaxRequestTimeoutInt < 0 ||
            ajaxRequestTimeoutInt > 2147483647
        ) {
            console.warn('Invalid value for ajaxRequestTimeout', ajaxRequestTimeout);
            return;
        }

        kyForApp.instance = kyForApp.instance.extend({
            timeout: ajaxRequestTimeoutInt
        });
    }, [ajaxRequestTimeout]);

    return null;
};

export { DevCustomizationsSetup };
