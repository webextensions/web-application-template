import React, { useEffect } from 'react';

import {
    useNavigate,
    useLocation
} from 'react-router';

import { ROOT_ACCOUNT } from '../../../../../backend/shared/pages/pageUrls.js';

import { toast } from 'react-toastify';

import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';

import { SignInForm } from './SignInForm/SignInForm.js';

import * as styles from './PageSignIn.css';

const PageSignIn = function () {
    const navigate = useNavigate();
    const loc = useLocation();

    const { flagUserIsRegistered } = useAuth();

    const searchParams = new URLSearchParams(loc.search);
    const successRedirect = searchParams.get('successRedirect') || ROOT_ACCOUNT;

    useEffect(() => {
        if (flagUserIsRegistered === 'yes') {
            navigate(successRedirect);
            toast.success('Signed in successfully', { pauseOnHover: false });
        }
    }, [flagUserIsRegistered, successRedirect]);

    const flagRedirecting = (flagUserIsRegistered === 'loading' || flagUserIsRegistered === 'yes');

    return (
        <div className={styles.PageSignIn}>
            <SignInForm redirecting={flagRedirecting} />
        </div>
    );
};

export { PageSignIn };
