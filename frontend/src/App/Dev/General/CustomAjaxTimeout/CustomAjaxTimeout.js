import React from 'react';

import { toast } from 'react-toastify';

import Button from '@mui/material/Button/index.js';

import { useDevCustomizations } from '../../../../base_modules/hooks/useDevCustomizations/useDevCustomizations.js';

import * as styles from './CustomAjaxTimeout.css';

const CustomAjaxTimeout = () => {
    const {
        ajaxRequestTimeout,
        setAjaxRequestTimeout
    } = useDevCustomizations();

    const [typedTimeout, setTypedTimeout] = React.useState(ajaxRequestTimeout);

    const updateTimeout = function () {
        const typedTimeoutInt = Number.parseInt(typedTimeout, 10);
        if (!typedTimeoutInt || Number.isNaN(typedTimeoutInt)) {
            toast.error('Please enter a valid number for delay in milliseconds.', {
                pauseOnHover: false,
                pauseOnFocusLoss: false
            });
            return;
        }

        setAjaxRequestTimeout(typedTimeout);
        toast.warn(`AJAX requests timeout is set to ${typedTimeout}ms.`, {
            pauseOnHover: false,
            pauseOnFocusLoss: false
        });
    };

    return (
        <div
            className={styles.CustomAjaxTimeout}
            style={{ display: 'flex' }}
        >
            <span style={{ alignContent: 'center' }}>
                AJAX requests timeout:
            </span>
            <div style={{ flex: 1, paddingLeft: 5, alignContent: 'center' }}>
                <input
                    style={{ width: '100%' }}
                    type="number"
                    min={0}
                    max={2147483647}
                    step={1000}
                    value={typedTimeout}
                    onChange={(evt) => {
                        if (evt.target.valueAsNumber < 0) {
                            setTypedTimeout('0');
                        } else if (evt.target.valueAsNumber > 2147483647) {
                            setTypedTimeout('2147483647');
                        } else {
                            setTypedTimeout(evt.target.value);
                        }
                    }}
                    onKeyDown={(evt) => {
                        if (evt.key === 'Enter') {
                            updateTimeout();
                        }
                    }}
                />
            </div>
            <div style={{ paddingLeft: 5 }}>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        updateTimeout();
                    }}
                >
                    Set
                </Button>
            </div>
            <div style={{ paddingLeft: 5 }}>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        const defaultTimeoutStr = '30000';
                        setTypedTimeout(defaultTimeoutStr);
                        setAjaxRequestTimeout(defaultTimeoutStr);
                        toast.info(`AJAX requests timeout is reset to ${defaultTimeoutStr}ms.`, {
                            pauseOnHover: false,
                            pauseOnFocusLoss: false
                        });
                    }}
                >
                    Reset
                </Button>
            </div>
        </div>
    );
};

export { CustomAjaxTimeout };
