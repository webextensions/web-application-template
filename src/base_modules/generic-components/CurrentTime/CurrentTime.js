import React from 'react';
import PropTypes from 'prop-types';

class CurrentTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        if (this.props.zone === 'utc') {
            return <>{this.state.date.toISOString().slice(11, 19)}</>;
        } else {
            return <>{new Date().toLocaleTimeString()}</>;
        }
    }
}

CurrentTime.propTypes = {
    zone: PropTypes.string
};

export { CurrentTime };
