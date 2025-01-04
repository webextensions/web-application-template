import React from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router';

import Drawer from '@mui/material/Drawer/index.js';
import List from '@mui/material/List/index.js';

import ListItemButton from '@mui/material/ListItemButton/index.js';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import ConstructionIcon from '@mui/icons-material/Construction';
import CodeIcon from '@mui/icons-material/Code';

import { toast } from 'react-toastify';

import { NonSelfLink } from '../../../base_modules/NonSelfLink/NonSelfLink.js';

import { useUserUuid } from '../../../base_modules/hooks/useUserUuid/useUserUuid.js';

import {
    ROOT,
    ROOT_ACCOUNT,
    ROOT_SIGN_IN,
    ROOT_UNDER_CONSTRUCTION
} from '../../../../../backend/shared/pages/pageUrls.js';

import * as styles from './MyDrawer.css';

const MyDrawer = ({ expanded, onClose }) => {
    const flagLinksToHiddenPages = true;
    const flagDevHelperMenuOption = true;

    const delayedHideDrawer = function () {
        setTimeout(() => {
            onClose();
        }, 150);
    };

    const navigate = useNavigate();

    const { forgetUserUuid } = useUserUuid();

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

                    <NonSelfLink to={ROOT_SIGN_IN} style={{ textDecoration: 'none' }}>
                        <ListItemButton onClick={delayedHideDrawer} style={{ color: '#fff' }}>
                            <LoginIcon sx={{ color: '#fff' }} />
                            <div style={{ marginLeft: 10 }}>
                                Sign in
                            </div>
                        </ListItemButton>
                    </NonSelfLink>
                    <NonSelfLink to={ROOT_SIGN_IN} style={{ textDecoration: 'none' }}>
                        <ListItemButton onClick={delayedHideDrawer} style={{ color: '#fff' }}>
                            <LogoutIcon sx={{ color: '#fff' }} />
                            <div
                                style={{ marginLeft: 10 }}
                                onClick={function (evt) {
                                    evt.preventDefault();
                                    forgetUserUuid();
                                    navigate(ROOT_SIGN_IN);
                                }}
                            >
                                Sign out
                            </div>
                        </ListItemButton>
                    </NonSelfLink>

                    {
                        flagLinksToHiddenPages &&
                        <NonSelfLink to={ROOT_ACCOUNT} style={{ textDecoration: 'none' }}>
                            <ListItemButton onClick={delayedHideDrawer} style={{ color: '#fff' }}>
                                <AccountCircleIcon sx={{ color: '#fff' }} />
                                <div style={{ marginLeft: 10 }}>
                                    Account
                                </div>
                            </ListItemButton>
                        </NonSelfLink>
                    }

                    <NonSelfLink to={ROOT} style={{ textDecoration: 'none' }}>
                        <ListItemButton onClick={delayedHideDrawer} style={{ color: '#fff' }}>
                            <HomeIcon sx={{ color: '#fff' }} />
                            <div style={{ marginLeft: 10 }}>
                                Home
                            </div>
                        </ListItemButton>
                    </NonSelfLink>

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
