import React from 'react';

import Button from '@mui/material/Button/index.js';

import { safeLocalStorage } from 'helpmate/dist/browser/safeLocalStorage.js';

import * as styles from './OpenAiApiKey.css';

const ensureOpenAiApiKey = function () {
    const openAiApiKey = safeLocalStorage.getItem('OPENAI_API_KEY') || '';

    const apiKey = prompt('Please enter your OpenAI API Key', openAiApiKey); // eslint-disable-line no-alert

    if (apiKey) {
        safeLocalStorage.setItem('OPENAI_API_KEY', apiKey);
        alert('OpenAI API key is set.'); // eslint-disable-line no-alert
        return true;
    } else {
        safeLocalStorage.removeItem('OPENAI_API_KEY');
        alert('OpenAI API key is unset.'); // eslint-disable-line no-alert
        return false;
    }
};

const OpenAiApiKey = () => {
    return (
        <div className={styles.OpenAiApiKey}>
            <div style={{ display: 'flex' }}>
                <div>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                            ensureOpenAiApiKey();
                        }}
                    >
                        Set/Unset OpenAI API Key
                    </Button>
                </div>
            </div>
        </div>
    );
};

export { OpenAiApiKey };