import React from 'react';

import * as styles from './PageFooter.css';

const PageFooter = function () {
    return (
        <div className={styles.PageFooter}>
            <div
                style={{
                    marginTop: 10,
                    textAlign: 'center',
                    color: '#bbb',
                    fontStyle: 'italic'
                }}
            >
                Footer
            </div>
        </div>
    );
};

export { PageFooter };
