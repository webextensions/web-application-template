import React from 'react';

import { MyAppBarAndDrawer } from './MyAppBarAndDrawer/MyAppBarAndDrawer.js';

import * as styles from './PageHeader.css';

const PageHeader = function () {
    return (
        <div className={styles.PageHeader}>
            <MyAppBarAndDrawer />
        </div>
    );
};

export { PageHeader };
