import React from 'react';

import * as styles from './Message.css';

const msgText = 'This message comes from a variable';

const Message = function () {
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
};

export { Message };
