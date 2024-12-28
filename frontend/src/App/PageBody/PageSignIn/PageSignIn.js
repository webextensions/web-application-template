import React from 'react';

import { SignInForm } from './SignInForm/SignInForm.js';

import * as styles from './PageSignIn.css';

const PageSignIn = function () {
    return (
        <div className={styles.PageSignIn}>
            <div>
                <SignInForm />
            </div>
        </div>
    );
};

export { PageSignIn };
