import React from 'react';

import * as styles from './PageHeader.css';

const PageHeader = function () {
    return (
        <div className={styles.PageHeader}>
            <div
                style={{
                    marginBottom: 10,
                    textAlign: 'center',
                    color: '#bbb',
                    fontStyle: 'italic'
                }}
            >
                Header
            </div>
        </div>
    );
};

export { PageHeader };
