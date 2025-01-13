import React from 'react';

import { useMinHeight } from '@webextensions/react/hooks/useMinHeight/useMinHeight.js';

import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';

import { EnsureLogin } from '../../Components/EnsureLogin/EnsureLogin.js';

import * as styles from './PageAccount.css';

const Content = function () {
    const {
        flagUserIsRegistered,
        authData
    } = useAuth();

    if (flagUserIsRegistered === 'yes') {
        const {
            uuid,
            id,
            name,
            email,
            joinedAt
        } = authData;

        const joinedAtAsLocalTimeInIsoLikeFormat = (new Date(joinedAt)).toISOString().slice(0, 16).replace('T', ' ');

        return (
            <React.Fragment>
                <h1>Account Information</h1>

                <div>
                    <p>User UUID: {uuid}</p>
                    <p>User ID: {id}</p>
                    <p>Name: {name}</p>
                    <p>Email: {email}</p>
                    <p>Joined at: {joinedAtAsLocalTimeInIsoLikeFormat}</p>
                </div>
            </React.Fragment>
        );
    }

    return null;
};

const PageAccount = function () {
    const { ref, removeMinHeight } = useMinHeight({ key: 'page-account' });

    return (
        <div ref={ref}>
            <EnsureLogin onLoadingDone={removeMinHeight}>
                <div className={styles.PageAccount}>
                    <Content />
                </div>
            </EnsureLogin>
        </div>
    );
};

export { PageAccount };
