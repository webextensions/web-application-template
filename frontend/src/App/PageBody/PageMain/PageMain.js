import React from 'react';

import { Demo } from '../../Components/Demo/Demo.js';

import * as styles from './PageMain.css';

const PageMain = function () {
    return (
        <div className={styles.PageMain}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20
                }}
            >
                <Demo />
            </div>
        </div>
    );
};

export { PageMain };
