import React from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router';

import IconButton from '@mui/material/IconButton/index.js';

import MenuIcon from '@mui/icons-material/Menu';

import { NonSelfLink } from '../../../base_modules/NonSelfLink/NonSelfLink.js';

import {
    ROOT,
    ROOT_ACCOUNT,
    ROOT_SIGN_IN
} from '../../../../../backend/shared/pages/pageUrls.js';

import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';
import { useUserUuid } from '../../../base_modules/hooks/useUserUuid/useUserUuid.js';

import * as styles from './MyToolBar.css';

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
                    style={{ color: '#fff', textDecoration: 'none' }}
                >
                    Sign out
                </a>
            }
            {
                flagUserIsRegistered === 'no' &&
                <NonSelfLink to={ROOT_SIGN_IN} style={{ color: '#fff', textDecoration: 'none' }}>
                    Sign in
                </NonSelfLink>
            }
        </div>
    );
};

const LinksInHeader = () => {
    return (
        <div
            className={styles.LinksInHeader}
            style={{
                display: 'flex',
                gap: 40
            }}
        >
            <div>
                <NonSelfLink to={ROOT} style={{ color: '#fff', textDecoration: 'none' }}>
                    Home
                </NonSelfLink>
            </div>
            <div>
                <NonSelfLink to={ROOT_ACCOUNT} style={{ color: '#fff', textDecoration: 'none' }}>
                    Account
                </NonSelfLink>
            </div>
            <div>
                <SignInOrSignOutLink />
            </div>
        </div>
    );
};

const MyToolBar = ({ style = {}, onMenuClick }) => {
    return (
        <div
            className={styles.MyToolBar}
            style={{
                paddingTop: 14,
                paddingBottom: 14,
                backgroundColor: '#152c4a',
                ...style
            }}
        >
            <div style={{ display: 'flex', paddingLeft: 35, paddingRight: 35 }}>
                <div className="flexCenterVertical">
                    <NonSelfLink to={ROOT} style={{ color: '#fff', textDecoration: 'none' }}>
                        <div
                            style={{
                                fontFamily: 'monospace',
                                borderWidth: 1,
                                borderColor: '#fff',
                                borderRadius: 5,
                                borderStyle: 'dashed',
                                padding: '5px 10px',
                                fontWeight: 'bold'
                            }}
                        >
                            Sample App
                        </div>
                    </NonSelfLink>
                </div>
                <div
                    className="flexCenterVertical"
                    style={{
                        flexGrow: 1,
                        containerType: 'inline-size'
                    }}
                >
                    <div
                        style={{ paddingLeft: 100, paddingRight: 100 }}
                        className="hideForContainerLT500"
                    >
                        <LinksInHeader />
                    </div>
                </div>
                <div>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={function () {
                            onMenuClick();
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};
MyToolBar.propTypes = {
    style: PropTypes.object,
    onMenuClick: PropTypes.func.isRequired
};

export { MyToolBar };
