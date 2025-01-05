import React from 'react';

import ReactScrollIntoViewIfNeeded from 'react-scroll-into-view-if-needed';

import { toast } from 'react-toastify';

import Button from '@mui/material/Button/index.js';

import { useAtom } from 'jotai';

import { useDevCustomizations } from '../../base_modules/hooks/useDevCustomizations/useDevCustomizations.js';

import Checkbox from '@mui/material/Checkbox/index.js';

import { ClickToShow } from '@webextensions/react/components/ClickToShow/ClickToShow.js';

import { ResponsiveDialog } from '../../base_modules/generic-components/ResponsiveDialog/ResponsiveDialog.js';

import { jotaiStore, ShowDevHelperAtom } from '../store/jotaiStore.js';

// eslint-disable-next-line import/extensions
import packageVersion from '../../../../package-version.json';
const { version } = packageVersion;

import FormControlLabel from '@mui/material/FormControlLabel/index.js';

import { useAuth } from '../../base_modules/hooks/useAuth/useAuth.js';

import * as styles from './DevHelper.css';

window.dev = function () {
    jotaiStore.set(ShowDevHelperAtom, true);
};

window.dev.hide = function () {
    jotaiStore.set(ShowDevHelperAtom, false);
};

const addQueryParameter = function (url, parameter, value) {
    if (url.includes(`${parameter}=${value}`)) {
        return url;
    } else if (url.includes('?')) {
        return `${url}&${parameter}=${value}`;
    } else {
        return `${url}?${parameter}=${value}`;
    }
};

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

const CustomAjaxTimeout = function () {
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
        <div style={{ display: 'flex' }}>
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

const DevHelper = function () {
    const {
        flagDifferentColorHeaderBackground,
        setFlagDifferentColorHeaderBackground,

        flagLinksToHiddenPages,
        setFlagLinksToHiddenPages,

        flagDevHelperMenuOption,
        setFlagDevHelperMenuOption
    } = useDevCustomizations();

    // eslint-disable-next-line no-unused-vars
    const [showDevHelper, setShowDevHelper] = useAtom(ShowDevHelperAtom);

    const handleClose = () => {
        setShowDevHelper(false);
    };

    return (
        <ResponsiveDialog
            title="Dev Helper"
            classNameForTitle="ResponsiveDialogTitle"
            className={styles.DevHelper}
            open={true}
            closable={true}
            onClose={handleClose}
            noPrimaryButton={true}
            draggable
        >
            <div style={{ minHeight: 75 }}>
                <div style={{ marginTop: 10 }}>
                    Application version: {version}
                </div>

                <div style={{ marginTop: 10 }}>
                    <CustomAjaxTimeout />
                </div>

                <div style={{ marginTop: 10 }}>
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

                <div style={{ marginTop: 10 }}>
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

                <div style={{ marginTop: 10, display: 'flex' }}>
                    <div style={{ flex: 1, alignContent: 'center' }}>
                        JS performance monitor:
                    </div>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={function () {
                            // Reference: https://github.com/mrdoob/stats.js/#bookmarklet
                            if (!window.flagStatsJsPerformanceMonitor) {
                                const script = document.createElement('script');
                                script.addEventListener('load', function () {
                                    const stats = new Stats(); // eslint-disable-line no-undef
                                    const elStats = document.body.appendChild(stats.dom); // eslint-disable-line unicorn/prefer-dom-node-append
                                    window.elStatsJsPerformanceMonitor = elStats;
                                    const style = elStats.style;
                                    style.top = '75px';
                                    style.right = '10px';
                                    style.left = '';
                                    style.zIndex = '100000';
                                    requestAnimationFrame(function loop() {
                                        stats.update();
                                        requestAnimationFrame(loop);
                                    });
                                });
                                script.src = '/resources/3rdparty/autoloaded/stats.js/stats.min.js';
                                document.head.append(script);

                                window.flagStatsJsPerformanceMonitor = true;
                            }

                            if (window.elStatsJsPerformanceMonitor) {
                                const style = window.elStatsJsPerformanceMonitor.style;
                                style.display = (style.display === 'none' ? '' : 'none');
                            }
                        }}
                    >
                        Show / Hide
                    </Button>
                </div>

                <div style={{ marginTop: 10 }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            throw new Error('Logging a dummy error.');
                        }}
                    >
                        Throw a dummy error
                    </Button>
                </div>

                <div style={{ marginTop: 10 }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            toast.info('This is a dummy toast', { pauseOnHover: false });
                        }}
                    >
                        Show a dummy toast
                    </Button>
                </div>

                <div style={{ marginTop: 20 }}>
                    <FormControlLabel
                        style={{ alignItems: 'flex-start' }}
                        control={
                            <Checkbox
                                style={{ paddingTop: 1 }}
                                checked={flagLinksToHiddenPages === 'yes'}
                                color="primary"
                                onChange={(evt) => {
                                    const checked = evt.target.checked;
                                    setFlagLinksToHiddenPages(checked ? 'yes' : 'no');
                                }}
                            />
                        }
                        label="Show hidden pages in menus"
                    />
                </div>

                <div style={{ marginTop: 10 }}>
                    <div>
                        <FormControlLabel
                            style={{ alignItems: 'flex-start' }}
                            control={
                                <Checkbox
                                    style={{ paddingTop: 1 }}
                                    checked={flagDevHelperMenuOption === 'yes'}
                                    color="primary"
                                    onChange={(evt) => {
                                        const checked = evt.target.checked;
                                        setFlagDevHelperMenuOption(checked ? 'yes' : 'no');
                                    }}
                                />
                            }
                            label={
                                <div>
                                    {`Always show 'Dev Helper' menu option`}
                                    <a
                                        href={addQueryParameter(window.location.href, 'flagDevHelperMenuOption', 'yes')}
                                        style={{ marginLeft: 10 }}
                                    >
                                        Link
                                    </a>
                                </div>
                            }
                        />
                    </div>
                    <div style={{ marginLeft: 30 }}>
                        <FormControlLabel
                            style={{ alignItems: 'flex-start' }}
                            control={
                                <Checkbox
                                    style={{ paddingTop: 1 }}
                                    checked={flagDifferentColorHeaderBackground === 'yes'}
                                    disabled={flagDevHelperMenuOption !== 'yes'}
                                    color="primary"
                                    onChange={(evt) => {
                                        const checked = evt.target.checked;
                                        setFlagDifferentColorHeaderBackground(checked ? 'yes' : 'no');
                                    }}
                                />
                            }
                            label="Show different color header background"
                        />
                    </div>
                </div>
            </div>
        </ResponsiveDialog>
    );
};

export { DevHelper };
