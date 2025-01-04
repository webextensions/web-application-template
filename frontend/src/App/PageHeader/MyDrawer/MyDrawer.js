import React from 'react';
import PropTypes from 'prop-types';

import Drawer from '@mui/material/Drawer/index.js';
import List from '@mui/material/List/index.js';

import ListItemButton from '@mui/material/ListItemButton/index.js';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConstructionIcon from '@mui/icons-material/Construction';
import CodeIcon from '@mui/icons-material/Code';

import { toast } from 'react-toastify';

import { NonSelfLink } from '../../../base_modules/NonSelfLink/NonSelfLink.js';

import { useUserUuid } from '../../../base_modules/hooks/useUserUuid/useUserUuid.js';

import {
    ROOT_ACCOUNT,
    ROOT_SIGN_IN,
    ROOT_UNDER_CONSTRUCTION
} from '../../../../../backend/shared/pages/pageUrls.js';

import { SignedInOrNot } from '../../Components/SignedInOrNot/SignedInOrNot.js';

import * as styles from './MyDrawer.css';

const timeout = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const MyDrawer = ({ expanded, onClose }) => {
    const flagLinksToHiddenPages = true;
    const flagDevHelperMenuOption = true;

    const delayedHideDrawer = function () {
        setTimeout(() => {
            onClose();
        }, 150);
    };

    const { forgetUserUuid } = useUserUuid();

    const SignInLink = (
        <NonSelfLink to={ROOT_SIGN_IN} style={{ textDecoration: 'none' }}>
            <ListItemButton onClick={delayedHideDrawer} style={{ color: '#fff' }}>
                <LoginIcon sx={{ color: '#fff' }} />
                <div style={{ marginLeft: 10 }}>
                    Sign In
                </div>
            </ListItemButton>
        </NonSelfLink>
    );

    return (
        <div className={styles.MyDrawer}>
            <Drawer
                anchor="right"
                open={expanded}
                onClose={onClose}
                SlideProps={{
                    style: { backgroundColor: '#152c4a', color: '#fff' }
                }}
            >
                <List style={{ paddingTop: 0 }}>
                    <div style={{ paddingTop: 4 }} />

                    <SignedInOrNot
                        WhenSignedError={SignInLink}
                        WhenSignedOut={SignInLink}
                        WhenSignedIn={
                            <NonSelfLink to={ROOT_ACCOUNT} style={{ textDecoration: 'none' }}>
                                <ListItemButton onClick={delayedHideDrawer} style={{ color: '#fff' }}>
                                    <AccountCircleIcon sx={{ color: '#fff' }} />
                                    <div style={{ marginLeft: 10 }}>
                                        Account
                                    </div>
                                </ListItemButton>
                            </NonSelfLink>
                        }
                    />

                    {
                        flagLinksToHiddenPages &&
                        <NonSelfLink to={ROOT_UNDER_CONSTRUCTION} style={{ textDecoration: 'none' }}>
                            <ListItemButton onClick={delayedHideDrawer} style={{ color: '#fff' }}>
                                <ConstructionIcon sx={{ color: '#fff' }} />
                                <div style={{ marginLeft: 10 }}>
                                    Under Construction
                                </div>
                            </ListItemButton>
                        </NonSelfLink>
                    }

                    <SignedInOrNot
                        WhenSignedIn={
                            <NonSelfLink to={ROOT_SIGN_IN} style={{ textDecoration: 'none' }}>
                                <ListItemButton onClick={delayedHideDrawer} style={{ color: '#fff' }}>
                                    <LogoutIcon sx={{ color: '#fff' }} />
                                    <div
                                        style={{ marginLeft: 10 }}
                                        onClick={function (evt) {
                                            evt.preventDefault();

                                            (async () => {
                                                // Added a delay to allow the drawer to close before navigating and the UI update (due to authSignOut()) should
                                                // be done together with the redirect to sign-in page.
                                                await timeout(300);

                                                forgetUserUuid();
                                            })();
                                        }}
                                    >
                                        Sign Out
                                    </div>
                                </ListItemButton>
                            </NonSelfLink>
                        }
                    />

                    {
                        flagDevHelperMenuOption &&
                        <ListItemButton
                            onClick={() => {
                                // window.dev(); // TODO: Pending
                                toast.warn('Dev Helper is under construction');

                                delayedHideDrawer();
                            }}
                            style={{ color: '#fff' }}
                        >
                            <CodeIcon sx={{ color: '#fff' }} />
                            <div style={{ marginLeft: 10 }}>
                                Dev Helper
                            </div>
                        </ListItemButton>
                    }
                </List>
            </Drawer>
        </div>
    );
};
MyDrawer.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export { MyDrawer };
