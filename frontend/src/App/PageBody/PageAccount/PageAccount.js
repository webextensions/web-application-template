import React, { useEffect } from 'react';

import { useNavigate } from 'react-router';

import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';

import { ROOT_SIGN_IN } from '../../../../../backend/shared/pages/pageUrls.js';

import * as styles from './PageAccount.css';

const PageAccount = function () {
    const {
        flagUserIsRegistered,
        authData
    } = useAuth();

    const navigate = useNavigate();

    // TODO: FIX-CODE-DUPLICATION: The redirection logic should be handled in a more generic way (Ref: PageTasks.js)
    useEffect(() => {
        if (flagUserIsRegistered === 'no') {
            const theCurrentFullPath = window.location.href.replace(window.location.origin, '');
                  // '/sign-in?successRedirect=/account'
            navigate(`${ROOT_SIGN_IN}?successRedirect=${encodeURIComponent(theCurrentFullPath)}`);
        }
    }, [flagUserIsRegistered]);

    if (flagUserIsRegistered === 'loading') {
        return (
            <div className={styles.PageAccount}>
                <h1>Account Information</h1>
                <p>Loading...</p>
            </div>
        );
    }

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
            <div className={styles.PageAccount}>
                <h1>Account Information</h1>

                <div>
                    <p>User UUID: {uuid}</p>
                    <p>User ID: {id}</p>
                    <p>Name: {name}</p>
                    <p>Email: {email}</p>
                    <p>Joined at: {joinedAtAsLocalTimeInIsoLikeFormat}</p>
                </div>
            </div>
        );
    }

    return null;
};

export { PageAccount };
