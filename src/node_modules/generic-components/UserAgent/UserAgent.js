import React from 'react';

function UserAgent(/* props */) {
    return (
        <>
            {window.navigator.userAgent}
        </>
    );
}

export { UserAgent };
