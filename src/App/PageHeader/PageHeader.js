import React from 'react';

import * as styles from './PageHeader.css';

import { CurrentTime } from 'generic-components/CurrentTime/CurrentTime.js';
import { UserAgent } from 'generic-components/UserAgent/UserAgent.js';

const PageHeader = function () {
    return (
        <div className={styles.PageHeader}>
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

export { PageHeader };
