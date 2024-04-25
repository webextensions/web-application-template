import React from 'react';
import PropTypes from 'prop-types';

import * as styles from './Todo.css';

const Todo = function ({ summary, status }) {
    return (
        <div className={styles.row}>
            <div>Summary: {summary}</div>
            <div>Status: {status}</div>
        </div>
    );
};

Todo.propTypes = {
    summary: PropTypes.string,
    status: PropTypes.string
};

export { Todo };
