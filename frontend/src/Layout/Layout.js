import React from 'react';
import PropTypes from 'prop-types';

import * as styles from './Layout.css';

const LayoutAbsoluteFullWidth = ({ children, style }) => {
    return (
        <div
            className={styles.LayoutAbsoluteFullWidth}
            style={style}
        >
            {children}
        </div>
    );
};
LayoutAbsoluteFullWidth.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
};

const LayoutFullWidth = ({ children, style }) => {
    return (
        <div
            className={styles.LayoutFullWidth}
            style={style}
        >
            {children}
        </div>
    );
};
LayoutFullWidth.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
};

const LayoutContentZone = ({ children, style }) => {
    return (
        <div
            className={styles.LayoutContentZone}
            style={style}
        >
            {children}
        </div>
    );
};
LayoutContentZone.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
};

export {
    LayoutAbsoluteFullWidth,
    LayoutFullWidth,
    LayoutContentZone
};
