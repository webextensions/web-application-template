import React from 'react';
import PropTypes from 'prop-types';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {
    copyToClipboard,
    isCopyToClipboardSupported
} from 'helpmate/dist/browser/copyToClipboard.js';

import { toast } from 'react-toastify';

import * as styles from './CopyToClipboard.css';

const CopyToClipboard = function ({ style, textToCopy, onClick }) {
    return (
        <div className={styles.CopyToClipboard} title="Copy to clipboard" style={style}>
            <ContentCopyIcon
                style={{ cursor: 'pointer' }}
                fontSize="small"
                onClick={(evt) => {
                    if (onClick) {
                        onClick(evt);
                    }

                    const text = (
                        (typeof textToCopy === 'function') ? textToCopy() : textToCopy
                    );

                    if (isCopyToClipboardSupported()) {
                        toast.success('Copied the content to clipboard');
                        copyToClipboard(text);
                    } else {
                        console.log('Copy to clipboard is not supported. Please copy the content below manually:');
                        console.log(text);
                        toast.error('Copy to clipboard is not supported. Please check the console to copy content to the clipboard manually.');
                    }
                }}
            />
        </div>
    );
};
CopyToClipboard.propTypes = {
    style: PropTypes.object,
    textToCopy: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]).isRequired,
    onClick: PropTypes.func
};

export { CopyToClipboard };
