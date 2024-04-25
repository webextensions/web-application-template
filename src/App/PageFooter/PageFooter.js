import React from 'react';

import * as styles from './PageFooter.css';

import { Message } from '../Message/Message.js';

const PageFooter = function () {
    return (
        <div className={styles.PageFooter}>
            <Message />
        </div>
    );
};

export { PageFooter };
