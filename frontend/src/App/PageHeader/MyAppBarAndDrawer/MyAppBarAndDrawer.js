import React, { useState } from 'react';
import PropTypes from 'prop-types';

import useScrollTrigger from '@mui/material/useScrollTrigger/index.js';
import Slide from '@mui/material/Slide/index.js';

import AppBar from '@mui/material/AppBar/index.js';

import { MyToolBar } from '../MyToolBar/MyToolBar.js';
import { MyDrawer } from '../MyDrawer/MyDrawer.js';

import * as styles from './MyAppBarAndDrawer.css';

const HideOnScroll = function (props) {
    /*
        References:
            https://material-ui.com/components/app-bar/#hide-app-bar
            https://codesandbox.io/s/spp4r
    */
    const { children, window } = props;
    // Note that, normally, it wouldn't be required to set the window ref as useScrollTrigger
    // will default to window. But, this can be useful in case of code execution inside iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};
HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func
};

const MyAppBarAndDrawer = () => {
    const [flagDrawerExpanded, setFlagDrawerExpanded] = useState(false);

    return (
        <div className={styles.MyAppBarAndDrawer}>
            <HideOnScroll>
                <AppBar>
                    <MyToolBar
                        onMenuClick={() => {
                            setFlagDrawerExpanded(true);
                        }}
                    />
                </AppBar>
            </HideOnScroll>

            {/*
                This duplicate <MyToolBar /> with "visibility: hidden" is used to occupy an appropriate placeholder since hide-on-scroll is implemented.
                References:
                    https://material-ui.com/components/app-bar/#fixed-placement
                    https://codesandbox.io/s/spp4r
            */}
            <MyToolBar style={{ visibility: 'hidden' }} />

            <MyDrawer
                expanded={flagDrawerExpanded}
                onClose={function () {
                    setFlagDrawerExpanded(false);
                }}
            />
        </div>
    );
};

export { MyAppBarAndDrawer };
