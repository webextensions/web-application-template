import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Loading } from '../../ImportedComponents/Loading/Loading.js';

const FETCHING = 'fetching';
const ERROR = 'error';

const LoadingErrorLoaded = function ({
    status,
    fetchStatus,

    error,
    data,
    showRawData,
    style
}) {
    const [errorData, setErrorData] = React.useState(null);
    useEffect(() => {
        if (error) {
            (async function () {
                const parsedErrorResponse = {};

                try {
                    const errResponse = error.response;

                    const text = await errResponse.text();
                    parsedErrorResponse.text = text;
                    try {
                        const json = JSON.parse(text);
                        parsedErrorResponse.json = json;
                    } catch (errJson) { // eslint-disable-line no-unused-vars
                        // Do nothing (swallowing the error)
                    }
                } catch (errText) { // eslint-disable-line no-unused-vars
                    // Do nothing (swallowing the error)
                }

                setErrorData(parsedErrorResponse);
            })();
        }
    }, [error]);

    if (fetchStatus === FETCHING) {
        return (
            <div style={style}>
                <Loading type="line-scale" />
            </div>
        );
    } else if (status === ERROR) {
        return (
            <div style={style}>
                <div
                    style={{ color: 'red' }}
                    title={(function () {
                        if (showRawData === 'as-tooltip' && errorData) {
                            return JSON.stringify(errorData, null, '    ');
                        } else {
                            return null;
                        }
                    })()}
                >
                    ✘ Error
                </div>
                {
                    showRawData === 'as-ui-element' &&
                    errorData &&
                    <div style={{ marginTop: 5, whiteSpace: 'pre', fontFamily: 'monospace' }}>
                        {JSON.stringify(errorData, null, '    ')}
                    </div>
                }
            </div>
        );
    } else if (status === 'success') {
        return (
            <div style={style}>
                <div
                    style={{ color: 'darkgreen' }}
                    title={(function () {
                        if (showRawData === 'as-tooltip' && data) {
                            return JSON.stringify(data, null, '    ');
                        } else {
                            return null;
                        }
                    })()}
                >
                    ✔ Success
                </div>
                {
                    showRawData === 'as-ui-element' &&
                    data &&
                    <div style={{ marginTop: 5, whiteSpace: 'pre', fontFamily: 'monospace', overflow: 'auto' }}>
                        {JSON.stringify(data, null, '    ')}
                    </div>
                }
            </div>
        );
    } else {
        return null;
    }
};
LoadingErrorLoaded.propTypes = {
    status: PropTypes.string,
    fetchStatus: PropTypes.string,
    error: PropTypes.object,

    data: PropTypes.object,
    showRawData: PropTypes.oneOf(['as-tooltip', 'as-ui-element']),
    style: PropTypes.object
};

export { LoadingErrorLoaded };
