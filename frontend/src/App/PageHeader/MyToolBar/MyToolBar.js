import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button/index.js';
import IconButton from '@mui/material/IconButton/index.js';

import MenuIcon from '@mui/icons-material/Menu';

import { NonSelfLink } from '../../../base_modules/NonSelfLink/NonSelfLink.js';

import { useDevCustomizations } from '../../../base_modules/hooks/useDevCustomizations/useDevCustomizations.js';
import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';

import {
    ROOT,
    ROOT_SIGN_IN,
    ROOT_TASKS,
    ROOT_UNDER_CONSTRUCTION
} from '../../../../../backend/shared/pages/pageUrls.js';

import { SignedInOrNot } from '../../Components/SignedInOrNot/SignedInOrNot.js';

import * as styles from './MyToolBar.css';

const SignInOrSignOutLink = function () {
    const SignInLink = (
        <NonSelfLink to={ROOT_SIGN_IN} style={{ color: '#fff', textDecoration: 'none' }}>
            <Button
                type="button"
                variant="contained"
                size="small"
                color="primary"
                style={{
                    color: '#152c4a',
                    backgroundColor: '#fff'
                }}
            >
                <span
                    style={{
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textTransform: 'none'
                    }}
                >
                    Sign In
                </span>
            </Button>
        </NonSelfLink>
    );

    return (
        <div>
            <SignedInOrNot
                WhenSignedError={SignInLink}
                WhenSignedOut={SignInLink}
            />
        </div>
    );
};

const LinksInHeader = () => {
    const { flagLinksToHiddenPages } = useDevCustomizations();

    const { flagUserIsRegistered } = useAuth();

    return (
        <div
            className={styles.LinksInHeader}
            style={{
                display: 'flex',
                gap: 40
            }}
        >
            <div style={{ flexGrow: 1 }}>
                <NonSelfLink to={ROOT} style={{ color: '#fff', textDecoration: 'none' }}>
                    Home
                </NonSelfLink>
            </div>
            {
                flagUserIsRegistered === 'yes' &&
                <div>
                    <NonSelfLink to={ROOT_TASKS} style={{ color: '#fff', textDecoration: 'none' }}>
                        Tasks
                    </NonSelfLink>
                </div>
            }
            {
                flagLinksToHiddenPages === 'yes' &&
                <div>
                    <NonSelfLink to={ROOT_UNDER_CONSTRUCTION} style={{ color: '#fff', textDecoration: 'none' }}>
                        Under Construction
                    </NonSelfLink>
                </div>
            }
        </div>
    );
};

const MyToolBar = ({ style = {}, onMenuClick }) => {
    const {
        flagDevHelperMenuOption,
        flagDifferentColorHeaderBackground
    } = useDevCustomizations();

    return (
        <div
            className={styles.MyToolBar}
            style={{
                paddingTop: 14,
                paddingBottom: 14,
                backgroundColor: '#152c4a',
                backgroundImage: (
                    (
                        flagDevHelperMenuOption === 'yes' &&
                        flagDifferentColorHeaderBackground === 'yes'
                    ) ?
                        'linear-gradient(rgb(21,171,196) 0%, #3960a0 80%)' :
                        undefined
                ),
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
                                padding: '8px 15px',
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
                <div className="flexCenterVertical">
                    <SignInOrSignOutLink />
                </div>
                <div style={{ marginLeft: 25 }}>
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
