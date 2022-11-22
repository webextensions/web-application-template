import React from 'react';

import styles from './PageFooter.css';

import { Message } from '../Message/Message.js';

class PageFooter extends React.Component {
    render() {
        return (
            <div className={styles.PageFooter}>
                <Message />
            </div>
        );
    }
}

export { PageFooter };
