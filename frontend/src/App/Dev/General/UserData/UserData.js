import React from 'react';

import ReactScrollIntoViewIfNeeded from 'react-scroll-into-view-if-needed';
import Button from '@mui/material/Button/index.js';

import { ClickToShow } from '@webextensions/react/components/ClickToShow/ClickToShow.js';

import { useAuth } from '../../../../base_modules/hooks/useAuth/useAuth.js';

import * as styles from './UserData.css';

const UserInfo = function () {
    const auth = useAuth();
    const data = {
        userUuid: auth.userUuid,
        granularUserIsRegistered: auth.granularUserIsRegistered,
        flagUserIsRegistered: auth.flagUserIsRegistered,
        authData: auth.authData
    };

    return (
        <textarea
            style={{
                width: '100%',
                fieldSizing: 'content',
                maxHeight: 350,
                border: '1px solid #777',
                padding: 8,
                whiteSpace: 'pre'
            }}
            readOnly
            value={JSON.stringify(data, null, '    ')}
        />
    );
};

const UserData = () => {
    return (
        <div className={styles.UserData}>
            <span style={{ flex: 1, alignContent: 'center' }}>
                User data:&nbsp;&nbsp;
            </span>
            <ClickToShow
                type="custom"
                CustomShowComponent={
                    <Button variant="contained" size="small">
                        Show
                    </Button>
                }
                CustomHideComponent={
                    <Button variant="contained" size="small">
                        Hide
                    </Button>
                }
            >
                <ReactScrollIntoViewIfNeeded options={{ behavior: 'smooth', scrollMode: 'if-needed', block: 'nearest' }}>
                    <UserInfo />
                </ReactScrollIntoViewIfNeeded>
            </ClickToShow>
        </div>
    );
};

export { UserData };
