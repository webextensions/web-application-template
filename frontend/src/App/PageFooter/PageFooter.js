import React from 'react';

import { GeneralLinks } from '../Components/GeneralLinks/GeneralLinks.js';

import * as styles from './PageFooter.css';

const PageFooter = function () {
    return (
        <div className={styles.PageFooter}>
            <div>
                <div style={{ fontSize: '24px' }}>
                    Links
                </div>
                <div style={{ marginTop: 10 }}>
                    <GeneralLinks />
                </div>
            </div>
        </div>
    );
};

export { PageFooter };
