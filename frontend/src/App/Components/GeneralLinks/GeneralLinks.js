import React from 'react';

import { useNavigate } from 'react-router';

import { NonSelfLink } from '../../../base_modules/NonSelfLink/NonSelfLink.js';

import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';
import { useUserUuid } from '../../../base_modules/hooks/useUserUuid/useUserUuid.js';

import {
    ROOT,
    ROOT_ACCOUNT,
    ROOT_SIGN_IN
} from '../../../../../backend/shared/pages/pageUrls.js';

import * as styles from './GeneralLinks.css';

const SignInOrSignOutLink = function () {
    const navigate = useNavigate();

    const { flagUserIsRegistered } = useAuth();
    const { forgetUserUuid } = useUserUuid();

    return (
        <div>
            {
                flagUserIsRegistered === 'yes' &&
                <a
                    href="#"
                    onClick={function (evt) {
                        evt.preventDefault();
                        forgetUserUuid();
                        navigate(ROOT_SIGN_IN);
                    }}
                    style={{ color: '#152c4a', textDecoration: 'none' }}
                >
                    Sign out
                </a>
            }
            {
                flagUserIsRegistered === 'no' &&
                <NonSelfLink to={ROOT_SIGN_IN} style={{ color: '#152c4a', textDecoration: 'none' }}>
                    Sign in
                </NonSelfLink>
            }
        </div>
    );
};

const GeneralLinks = function () {
    return (
        <div className={styles.GeneralLinks}>
            <div>
                <NonSelfLink to={ROOT} style={{ color: '#152c4a', textDecoration: 'none' }}>
                    Home
                </NonSelfLink>
            </div>
            <div style={{ marginTop: 8 }}>
                <NonSelfLink to={ROOT_ACCOUNT} style={{ color: '#152c4a', textDecoration: 'none' }}>
                    Account
                </NonSelfLink>
            </div>
            <div style={{ marginTop: 8 }}>
                <SignInOrSignOutLink />
            </div>
        </div>
    );
};

export { GeneralLinks };
