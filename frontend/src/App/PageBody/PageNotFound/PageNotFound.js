import React from 'react';

import * as styles from './PageNotFound.css';

const PageNotFound = function () {
    return (
        <div className={styles.PageNotFound}>
            <h1>Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
};

export { PageNotFound };
