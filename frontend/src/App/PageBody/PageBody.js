import React from 'react';
import PropTypes from 'prop-types';

import {
    Routes,
    Route,
    useLocation
} from 'react-router';

import { ErrorBoundary } from 'react-error-boundary';

import { useUpdateEffect, usePrevious } from 'react-use';

import * as styles from './PageBody.css';

import { PageAccount } from './PageAccount/PageAccount.js';
import { PageMain } from './PageMain/PageMain.js';
import { PageSignIn } from './PageSignIn/PageSignIn.js';

import { PageUnderConstruction } from './PageUnderConstruction/PageUnderConstruction.js';

import { PageNotFound } from './PageNotFound/PageNotFound.js';
import {
    ROOT,
    ROOT_ACCOUNT,
    ROOT_SIGN_IN,
    ROOT_UNDER_CONSTRUCTION
} from '../../../../backend/shared/pages/pageUrls.js';

const ErrorLayer = function ({ error, resetErrorBoundary }) {
    const location = useLocation();

    const prevPathname = usePrevious(location.pathname);

    useUpdateEffect(() => {
        // TODO: Log error to server / error tracker
        console.error(error);
        resetErrorBoundary();
    }, [location.pathname]);

    const pageChanged = prevPathname && (prevPathname !== location.pathname);
    return (
        <div
            style={{
                display: 'grid',
                justifyContent: 'center',

                // This is useful for hiding the message when the page changes which would be followed by
                // call to `resetErrorBoundary()` up on `useUpdateEffect()` hook. This avoids the momentary
                // display of the error message with the new page location (`location.pathname`).
                opacity: pageChanged ? 0 : 1
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span>
                    Unexpected error on page
                    {' '}
                    <a href={location.pathname}>{location.pathname}</a>
                </span>
            </div>
        </div>
    );
};
ErrorLayer.propTypes = {
    error: PropTypes.object.isRequired,
    resetErrorBoundary: PropTypes.func.isRequired
};

const PageBody = function () {
    return (
        <div className={styles.PageBody}>
            <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => {
                    return (
                        <ErrorLayer
                            error={error}
                            resetErrorBoundary={resetErrorBoundary}
                        />
                    );
                }}
            >
                <Routes>
                    <Route exact path={ROOT}                           element={<PageMain              />} />
                    <Route exact path={ROOT_ACCOUNT}                   element={<PageAccount           />} />
                    <Route exact path={ROOT_SIGN_IN}                   element={<PageSignIn            />} />
                    <Route exact path={ROOT_UNDER_CONSTRUCTION}        element={<PageUnderConstruction />} />
                    <Route       path="*"                              element={<PageNotFound          />} />
                </Routes>
            </ErrorBoundary>
        </div>
    );
};

export { PageBody };
