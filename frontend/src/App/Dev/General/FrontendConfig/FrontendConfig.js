import React from 'react';

import ReactScrollIntoViewIfNeeded from 'react-scroll-into-view-if-needed';

import Button from '@mui/material/Button/index.js';
import { ClickToShow } from '@webextensions/react/components/ClickToShow/ClickToShow.js';

import * as styles from './FrontendConfig.css';

const FrontendConfig = () => {
    return (
        <div className={styles.FrontendConfig}>
            <span style={{ flex: 1, alignContent: 'center' }}>
                Frontend Config:&nbsp;&nbsp;
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
                        value={
                            JSON.stringify(window.frontEndConfig, null, '    ')
                        }
                    />
                </ReactScrollIntoViewIfNeeded>
            </ClickToShow>
        </div>
    );
};

export { FrontendConfig };
