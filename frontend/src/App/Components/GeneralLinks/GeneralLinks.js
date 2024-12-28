import React from 'react';

import { NonSelfLink } from '../../../base_modules/NonSelfLink/NonSelfLink.js';

import {
    ROOT,
    ROOT_ACCOUNT,
    ROOT_SIGN_IN
} from '../../../../../backend/shared/pages/pageUrls.js';

import * as styles from './GeneralLinks.css';

const GeneralLinks = function () {
    return (
        <div className={styles.GeneralLinks}>
            <div>
                <NonSelfLink to={ROOT} style={{ textDecoration: 'none' }}>
                    Home
                </NonSelfLink>
            </div>
            <div>
                <NonSelfLink to={ROOT_ACCOUNT} style={{ textDecoration: 'none' }}>
                    Account
                </NonSelfLink>
            </div>
            <div>
                <NonSelfLink to={ROOT_SIGN_IN} style={{ textDecoration: 'none' }}>
                    Sign-in
                </NonSelfLink>
            </div>
        </div>
    );
};

export { GeneralLinks };
