import React from 'react';

import styles from './PageBody.css';

import {
    Loading,
    LoadingTriggeredAfterDelay
} from '../../ImportedComponents/Loading/Loading.js';

import { ClickToShow } from '@webextensions/react/components/ClickToShow/ClickToShow.js';

import { CopyIcon } from '@webextensions/react/components/CopyIcon/CopyIcon.js';

const PageBody = function () {
    return (
        <div className={styles.PageBody}>
            <div>
                <ClickToShow type="button">
                    <div style={{ margin: 20 }}>
                        Show this long message when clicked.
                    </div>
                </ClickToShow>
            </div>

            <div>
                <CopyIcon data={'Dummy content copied to clipboard'} />
            </div>

            <div>
                <LoadingTriggeredAfterDelay
                    type="line-scale"
                    style={{ width: '100px', height: '100px' }}
                    theme="dark"
                    delay={1000}
                />
            </div>

            <div>
                <Loading
                    type="line-scale"
                    style={{ width: '100px', height: '100px' }}
                    theme="dark"
                />
            </div>
        </div>
    );
};

export { PageBody };
