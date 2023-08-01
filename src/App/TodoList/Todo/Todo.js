import React from 'react';
import PropTypes from 'prop-types';

import styles from './Todo.css';

class Todo extends React.Component {
    render() {
        return (
            <div className={styles.row}>
                <div>Summary: {this.props.summary}</div>
                <div>Status: {this.props.status}</div>
            </div>
        );
    }
}

Todo.propTypes = {
    summary: PropTypes.string,
    status: PropTypes.string
};

export { Todo };
