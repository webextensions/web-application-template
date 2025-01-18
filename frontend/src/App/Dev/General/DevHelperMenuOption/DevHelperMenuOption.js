import React from 'react';

import FormControlLabel from '@mui/material/FormControlLabel/index.js';

import Checkbox from '@mui/material/Checkbox/index.js';

import { useDevCustomizations } from '../../../../base_modules/hooks/useDevCustomizations/useDevCustomizations.js';

import * as styles from './DevHelperMenuOption.css';

const addQueryParameter = function (url, parameter, value) {
    if (url.includes(`${parameter}=${value}`)) {
        return url;
    } else if (url.includes('?')) {
        return `${url}&${parameter}=${value}`;
    } else {
        return `${url}?${parameter}=${value}`;
    }
};

const DevHelperMenuOption = () => {
    const {
        flagDifferentColorHeaderBackground,
        setFlagDifferentColorHeaderBackground,

        flagDevHelperMenuOption,
        setFlagDevHelperMenuOption
    } = useDevCustomizations();

    return (
        <div className={styles.DevHelperMenuOption}>
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
    );
};

export { DevHelperMenuOption };
