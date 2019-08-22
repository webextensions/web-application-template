import React from 'react';

import './Message.css';

const msgText = 'This message comes from a variable';

class Message extends React.Component {
    render() {
        return (
            <>
                <div className="msg">
                    This is a static message
                </div>
                <div className="msg">
                    {msgText}
                </div>
            </>
        );
    }
}

export default Message;
