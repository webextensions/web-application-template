import React from 'react';
import PropTypes from 'prop-types';

import './Todo.css';

class Todo extends React.Component {
    render() {
        return (
            <div className="row">
                <div>Summary: {this.props.summary}</div>
                <div style={{ marginLeft: '10px' }}>Status: {this.props.status}</div>
            </div>
        );
    }
}

Todo.propTypes = {
    summary: PropTypes.string,
    status: PropTypes.string
};

export { Todo };
