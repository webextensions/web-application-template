import React from 'react';

import * as styles from './PageFooter.css';

import { Message } from '../Message/Message.js';

import { AfterDelay } from '@webextensions/react/components/AfterDelay/AfterDelay.js';

import { Loading } from '../../ImportedComponents/Loading/Loading.js';

import { ClickToShow } from '@webextensions/react/components/ClickToShow/ClickToShow.js';

import { CopyIcon } from '@webextensions/react/components/CopyIcon/CopyIcon.js';

import { CurrentTime } from '../../base_modules/generic-components/CurrentTime/CurrentTime.js';
import { UserAgent } from '../../base_modules/generic-components/UserAgent/UserAgent.js';

const PageFooter = function () {
    return (
        <div className={styles.PageFooter}>
            <Message />

            <div>
                <ClickToShow type="button">
                    <div style={{ margin: 20 }}>
                        Show this long message when clicked.
                    </div>
                </ClickToShow>
            </div>

            <div>
                <CopyIcon data="Dummy content copied to clipboard" />
            </div>

            <div>
                <AfterDelay delay={1000}>
                    <Loading
                        type="line-scale"
                        style={{ width: '100px', height: '100px' }}
                        theme="dark"
                    />
                </AfterDelay>
            </div>

            <div>
                <Loading
                    type="line-scale"
                    style={{ width: '100px', height: '100px' }}
                    theme="dark"
                />
            </div>

            <div>
                Current time: <CurrentTime />
            </div>
            <div>
                Current UTC time: <CurrentTime zone="utc" />
            </div>
            <div>
                User Agent: <UserAgent />
            </div>
        </div>
    );
};

export { PageFooter };
