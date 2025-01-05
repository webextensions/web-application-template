import React from 'react';

import { useAtom } from 'jotai';

import { ToastContainer } from 'react-toastify';

import { DevHelper } from '../Dev/DevHelper.js';

import { ShowDevHelperAtom } from '../store/jotaiStore.js';

const PageWidgets = function () {
    const [showDevHelper] = useAtom(ShowDevHelperAtom);
    return (
        <React.Fragment>
            <ToastContainer />

            {
                showDevHelper &&
                <DevHelper />
            }
        </React.Fragment>
    );
};

export { PageWidgets };
