import React from 'react';

import { AfterDelay } from '@webextensions/react/components/AfterDelay/AfterDelay.js';

import { NonSelfLink } from '../../../base_modules/NonSelfLink/NonSelfLink.js';

import { useUserUuid } from '../../../base_modules/hooks/useUserUuid/useUserUuid.js';

import { SignedInOrNot } from '../SignedInOrNot/SignedInOrNot.js';

import {
    ROOT,
    ROOT_SIGN_IN,
    ROOT_UNDER_CONSTRUCTION
} from '../../../../../backend/shared/pages/pageUrls.js';

import { useDevCustomizations } from '../../../base_modules/hooks/useDevCustomizations/useDevCustomizations.js';

import * as styles from './GeneralLinks.css';

const SignInOrSignOutLink = function () {
    const { forgetUserUuid } = useUserUuid();

    const SignInLink = (
        <NonSelfLink to={ROOT_SIGN_IN} style={{ color: '#152c4a', textDecoration: 'none' }}>
            Sign In
        </NonSelfLink>
    );

    const SignOutLink = (
        <a
            href="#"
            onClick={function (evt) {
                evt.preventDefault();
                forgetUserUuid();
            }}
            style={{ color: '#152c4a', textDecoration: 'none' }}
        >
            Sign Out
        </a>
    );

    return (
        <div>
            <SignedInOrNot
                WhenSignedUnknown={null}
                WhenSignedLoading={
                    <AfterDelay delay={2500}>
                        ...
                    </AfterDelay>
                }
                WhenSignedError={SignInLink}
                WhenSignedOut={SignInLink}
                WhenSignedIn={SignOutLink}
            />
        </div>
    );
};

const GeneralLinks = function () {
    const { flagLinksToHiddenPages } = useDevCustomizations();

    return (
        <div className={styles.GeneralLinks}>
            <div>
                <NonSelfLink to={ROOT} style={{ color: '#152c4a', textDecoration: 'none' }}>
                    Home
                </NonSelfLink>
            </div>

            {
                flagLinksToHiddenPages === 'yes' &&
                <div style={{ marginTop: 8 }}>
                    <NonSelfLink to={ROOT_UNDER_CONSTRUCTION} style={{ color: '#152c4a', textDecoration: 'none' }}>
                        Under Construction
                    </NonSelfLink>
                </div>
            }

            <div style={{ marginTop: 8 }}>
                <SignInOrSignOutLink />
            </div>
        </div>
    );
};

export { GeneralLinks };
