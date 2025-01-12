import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router';

import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';

import { ROOT_SIGN_IN } from '../../../../../backend/shared/pages/pageUrls.js';

const EnsureLogin = ({ children }) => {
    const { flagUserIsRegistered } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (flagUserIsRegistered === 'no') {
            const theCurrentFullPath = window.location.href.replace(window.location.origin, '');
                     // eg: '/sign-in?successRedirect=%2Faccount'
            navigate(`${ROOT_SIGN_IN}?successRedirect=${encodeURIComponent(theCurrentFullPath)}`);
        }
    }, [flagUserIsRegistered]);

    if (flagUserIsRegistered === 'yes') {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    } else {
        return null;
    }
};
EnsureLogin.propTypes = {
    children: PropTypes.node.isRequired
};

export { EnsureLogin };
