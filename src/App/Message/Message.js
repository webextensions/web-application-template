import React from 'react';

import styles from './Message.css';

const msgText = 'This message comes from a variable';

class Message extends React.Component {
    render() {
        return (
            <>
                <div className={styles.msg}>
                    This is a static message
                </div>
                <div className={styles.msg}>
                    {msgText}
                </div>
            </>
        );
    }
}

export { Message };
