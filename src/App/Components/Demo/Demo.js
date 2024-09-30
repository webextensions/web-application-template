import React from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility'; // eslint-disable-line node/file-extension-in-import

import { toast } from '../../../ImportedComponents/react-toastify.js';

import { GenericAccordion } from '../../../base_modules/GenericAccordion/GenericAccordion.js';

import { Loading } from '../../../ImportedComponents/Loading/Loading.js';

import { AfterDelay } from '@webextensions/react/components/AfterDelay/AfterDelay.js';

import { ClickToShow } from '@webextensions/react/components/ClickToShow/ClickToShow.js';

import { CopyIcon } from '@webextensions/react/components/CopyIcon/CopyIcon.js';

import { CurrentTime } from '../../../base_modules/generic-components/CurrentTime/CurrentTime.js';

import * as styles from './Demo.css';

const DemoAfterDelay = function () {
    return (
        <AfterDelay delay={1000}>
            This text is shown after a delay of 1 second.
        </AfterDelay>
    );
};

const DemoToastOnButton = function () {
    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <button
                type="button"
                onClick={() => {
                    toast.error('Demo error');
                }}
            >
                Error
            </button>

            <button
                type="button"
                onClick={() => {
                    toast.warn('Demo warning');
                }}
            >
                Warning
            </button>

            <button
                type="button"
                onClick={() => {
                    toast.success('Demo success');
                }}
            >
                Success
            </button>
        </div>
    );
};

const DemoLoading = function () {
    return (
        <div>
            <Loading
                type="line-scale"
                style={{ width: '100px' }}
                theme="dark"
            />
        </div>
    );
};

const DemoClickToShow = function () {
    return (
        <ClickToShow type="button">
            <div style={{ margin: 20 }}>
                Show this content when clicked.
            </div>
        </ClickToShow>
    );
};

const DemoCopyIcon = function () {
    return (
        <div>
            <CopyIcon data="Dummy content copied to clipboard" />
        </div>
    );
};

const DemoCurrentTime = function () {
    return (
        <div>
            <div>
                Current time: <CurrentTime />
            </div>
            <div>
                Current UTC time: <CurrentTime zone="utc" />
            </div>
        </div>
    );
};

const DemoContainer = function () {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20
            }}
        >
            <div>
                <DemoAfterDelay />
            </div>

            <div>
                <DemoToastOnButton />
            </div>

            <div>
                <DemoLoading />
            </div>

            <div>
                <DemoClickToShow />
            </div>

            <div>
                <DemoCopyIcon />
            </div>

            <div>
                <DemoCurrentTime />
            </div>
        </div>
    );
};

const Demo = function () {
    return (
        <div className={styles.Demo}>
            <GenericAccordion
                localStorageIdForExpanded="flagPanelDemo"
                title={<div style={{ lineHeight: '25px' }}>Demo Components</div>}
                icon={<VisibilityIcon />}
            >
                <DemoContainer />
            </GenericAccordion>
        </div>
    );
};

export { Demo };
