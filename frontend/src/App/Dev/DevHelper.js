import React from 'react';

import { toast } from 'react-toastify';

import Button from '@mui/material/Button/index.js';

import { useAtom } from 'jotai';

import { useDevCustomizations } from '../../base_modules/hooks/useDevCustomizations/useDevCustomizations.js';

import Checkbox from '@mui/material/Checkbox/index.js';

import { ResponsiveDialog } from '../../base_modules/generic-components/ResponsiveDialog/ResponsiveDialog.js';

import { jotaiStore, ShowDevHelperAtom } from '../store/jotaiStore.js';

// eslint-disable-next-line import/extensions
import packageVersion from '../../../../package-version.json';
const { version } = packageVersion;

import FormControlLabel from '@mui/material/FormControlLabel/index.js';

import { CustomAjaxTimeout } from './General/CustomAjaxTimeout/CustomAjaxTimeout.js';
import { FrontendConfig } from './General/FrontendConfig/FrontendConfig.js';
import { UserData } from './General/UserData/UserData.js';
import { OpenAiApiKey } from './General/OpenAiApiKey/OpenAiApiKey.js';
import { JsPerformanceMonitor } from './General/JsPerformanceMonitor/JsPerformanceMonitor.js';
import { DevHelperMenuOption } from './General/DevHelperMenuOption/DevHelperMenuOption.js';

import * as styles from './DevHelper.css';

window.dev = function () {
    jotaiStore.set(ShowDevHelperAtom, true);
};

window.dev.hide = function () {
    jotaiStore.set(ShowDevHelperAtom, false);
};

const ThrowDummyError = function () {
    return (
        <Button
            variant="contained"
            size="small"
            onClick={() => {
                throw new Error('Logging a dummy error.');
            }}
        >
            Throw a dummy error
        </Button>
    );
};

const ShowDummyToast = function () {
    return (
        <Button
            variant="contained"
            size="small"
            onClick={() => {
                toast.info('This is a dummy toast', { pauseOnHover: false });
            }}
        >
            Show a dummy toast
        </Button>
    );
};

const ShowHiddenPagesInMenus = function () {
    const {
        flagLinksToHiddenPages,
        setFlagLinksToHiddenPages
    } = useDevCustomizations();

    return (
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
    );
};

const DevHelper = function () {
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
                    <FrontendConfig />
                </div>

                <div style={{ marginTop: 10 }}>
                    <UserData />
                </div>

                <div style={{ marginTop: 10 }}>
                    <JsPerformanceMonitor />
                </div>

                <div style={{ marginTop: 10 }}>
                    <OpenAiApiKey />
                </div>

                <div style={{ marginTop: 10 }}>
                    <ThrowDummyError />
                </div>

                <div style={{ marginTop: 10 }}>
                    <ShowDummyToast />
                </div>

                <div style={{ marginTop: 20 }}>
                    <ShowHiddenPagesInMenus />
                </div>

                <div style={{ marginTop: 10 }}>
                    <DevHelperMenuOption />
                </div>
            </div>
        </ResponsiveDialog>
    );
};

export { DevHelper };
