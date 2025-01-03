import React from 'react';

import { GeneralLinks } from '../Components/GeneralLinks/GeneralLinks.js';

import {
    LayoutContentZone,
    LayoutFullWidth
} from '../../Layout/Layout.js';

import * as styles from './PageFooter.css';

const PageFooter = function () {
    return (
        <div
            className={styles.PageFooter}
            style={{ backgroundColor: 'rgb(232, 234, 237)' }}
        >
            <LayoutFullWidth>
                <LayoutContentZone>
                    <div>
                        <div style={{ fontSize: '24px', fontVariantCaps: 'small-caps' }}>
                            Links
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <GeneralLinks />
                        </div>
                    </div>
                </LayoutContentZone>
            </LayoutFullWidth>
        </div>
    );
};

export { PageFooter };
