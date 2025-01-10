import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ky from 'ky';

import 'rc-collapse/assets/index.css';
import Collapse from 'rc-collapse';

import Button from '@mui/material/Button/index.js';
import IconButton from '@mui/material/IconButton/index.js';

import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { useMediaQuery } from 'react-responsive';

import { randomUUID } from 'helpmate/dist/uuid/randomUUID.js';

import { useQuery } from '@tanstack/react-query';

import { Loading } from '../../../../ImportedComponents/Loading/Loading.js';

import { ViewCode } from '../../../base_modules/ViewCode/ViewCode.js';

import { safeArrayPromiseToErrorPromise } from '../../../../App/utils/safeArrayPromiseToErrorPromise.js';

import './AjaxRequest.css';
import { BuildForm } from './BuildForm.js';

const ajaxRequestConfigs = [
    {
        label: 'Admin',
        options: [
            {
                id: 'Help (Routes)',
                method: 'GET',
                url:        '/admin/help',
                defaultUrl: '/admin/help?responseFormat=json',
                // form: {
                //     schema: {
                //         type: 'object',
                //         // required: ['responseFormat'],
                //         properties: {
                //             responseFormat: {
                //                 type: 'string',
                //                 title: 'Type of response'
                //             }
                //         }
                //     },
                //     uiSchema: {
                //         responseFormat: {
                //             'ui:placeholder': 'html or json'
                //         }
                //     },
                //     formData: {
                //         responseFormat: 'json'
                //     }
                // }
                form: {
                    schema: {
                        type: 'object',
                        properties: {
                            responseFormat: {
                                type: 'string',
                                title: 'responseFormat',
                                enum: ['', 'html', 'json'],
                                default: 'json'
                            }
                        }
                    }
                }
            },
            {
                id: 'Info',
                url: '/admin/info'
            },
            {
                id: 'Kill server instance',
                url: '/admin/kill'
            },
            {
                id: 'Setup database',
                url: '/admin/setupDb'
            }
        ]
    },
    {
        label: 'Admin - Users',
        options: [
            {
                id: 'List all users',
                url: '/admin/users/list'
            },
            {
                id: 'Create a user',
                method: 'POST',
                url: '/admin/users/create',
                form: {
                    schema: {
                        type: 'object',
                        required: ['id', 'name', 'email', 'password'],
                        properties: {
                            id: {
                                type: 'string',
                                title: 'id'
                            },
                            name: {
                                type: 'string',
                                title: 'name'
                            },
                            email: {
                                type: 'string',
                                title: 'email'
                            },
                            password: {
                                type: 'string',
                                title: 'password'
                            },
                            joinedAt: {
                                type: 'number',
                                title: 'joinedAt'
                            }
                        }
                    },
                    uiSchema: {
                        password: {
                            'ui:widget': 'password'
                        }
                    },
                    formData: {
                        id: 'abc',
                        name: 'Abc Xyz',
                        email: 'mail@example.com',
                        password: '123456',
                        joinedAt: Date.now()
                    }
                }
            },
            {
                id: 'Login as user',
                url: '/admin/users/{userUuid}/loginAs'
            },
            {
                id: 'Admin > Set password',
                title: 'Set password',
                method: 'POST',
                url: '/admin/users/{userId}/setPassword',
                form: {
                    schema: {
                        type: 'object',
                        required: [
                            'newPassword'
                        ],
                        properties: {
                            newPassword: {
                                type: 'string',
                                title: 'New password'
                            }
                        }
                    },
                    uiSchema: {
                        newPassword: {
                            'ui:widget': 'password'
                        }
                    },
                    formData: {
                        newPassword: ''
                    }
                }
            }
        ]
    },
    {
        label: 'User',
        options: [
            {
                id: 'User > Info',
                title: 'Info',
                url: '/api/v1/users/{userId}/owninfo'
            },
            {
                id: 'User > Update password',
                title: 'Update password',
                method: 'POST',
                url: '/api/v1/users/{userId}/updatePassword',
                form: {
                    schema: {
                        type: 'object',
                        required: [
                            'oldPassword',
                            'newPassword'
                        ],
                        properties: {
                            oldPassword: {
                                type: 'string',
                                title: 'Old password'
                            },
                            newPassword: {
                                type: 'string',
                                title: 'New password'
                            }
                        }
                    },
                    uiSchema: {
                        oldPassword: {
                            'ui:widget': 'password'
                        },
                        newPassword: {
                            'ui:widget': 'password'
                        }
                    },
                    formData: {
                        oldPassword: '',
                        newPassword: ''
                    }
                }
            },
            {
                id: 'User > whoami',
                title: '/whoami',
                url: '/whoami'
            }
        ]
    },
    {
        label: 'General',
        options: [
            {
                id: 'List all task categories',
                url: '/taskCategories/list'
            }
        ]
    }
];

const ResetUrl = function ({
    canHoldInputElementsInRow,
    requestConfig,
    setTypedValueForUrl
}) {
    return (
        <div
            style={{
                marginLeft: canHoldInputElementsInRow ? 15 : 5,
                textAlign: 'center'
            }}
        >
            <IconButton
                type="button"
                size="small"
                title="Reset URL"
                onClick={() => {
                    if (requestConfig) {
                        setTypedValueForUrl(requestConfig.defaultUrl || requestConfig.url);

                        // // TODO: Check how something on the following lines can be implemented to reset the form.
                        // //       Currently, this will not work because the state for the form isn't being controlled
                        // //       like this.
                        // setProvidedParameters(requestConfig.form?.formData || {});
                    }
                }}
            >
                <RestartAltIcon />
            </IconButton>
        </div>
    );
};
ResetUrl.propTypes = {
    canHoldInputElementsInRow: PropTypes.bool.isRequired,
    requestConfig: PropTypes.object.isRequired,
    setTypedValueForUrl: PropTypes.func.isRequired
};

const accessUrlAndParse = async function ({
    method,
    url,
    parameters
}) {
    try {
        const response = await ky(url, {
            method,
            json: (function () {
                if (
                    method !== 'HEAD' &&
                    method !== 'DELETE' &&
                    method !== 'PATCH' &&
                    method !== 'POST' &&
                    method !== 'PUT'
                ) {
                    return undefined;
                }
                if (JSON.stringify(parameters) === '{}') {
                    return undefined;
                }

                return parameters;
            })(),
            retry: 0
        });

        const text = await response.text();
        try {
            const json = JSON.parse(text);
            return [null, { text, json }];
        } catch (err) { // eslint-disable-line no-unused-vars
            return [null, { text }];
        }
    } catch (err) {
        const parsedResponse = {};

        try {
            const response = err.response;

            const text = await response.text();
            parsedResponse.text = text;
            try {
                const json = JSON.parse(text);
                parsedResponse.json = json;
            } catch (errJson) { // eslint-disable-line no-unused-vars
                // Do nothing (swallowing the error)
            }
        } catch (errText) { // eslint-disable-line no-unused-vars
            // Do nothing (swallowing the error)
        }

        return [err, parsedResponse];
    }
};

const AjaxRequest = function () {
    const canHoldInputElementsInRow = useMediaQuery({ query: '(min-width: 1024px)' });

    const [requestedUrl, setRequestedUrl] = useState('');

    const [selectedAjaxUrl, setSelectedAjaxUrl] = useState('none');
    const [typedValueForUrl, setTypedValueForUrl] = useState('');
    const [providedParameters, setProvidedParameters] = useState({});
    const [requestConfig, setRequestConfig] = useState(null);

    const [ajaxHistory, setAjaxHistory] = useState([]);

    const [theRequestMethod, setTheRequestMethod] = useState('GET');

    const { refetch } = useQuery({
        enabled: false,
        queryKey: ['ajaxHistory'],
        queryFn: () => {
            const url = typedValueForUrl;

            const p = accessUrlAndParse({
                method: theRequestMethod,
                url,
                parameters: providedParameters
            });

            const entry = {
                uuid: randomUUID(),
                url,
                initiatedAt: Date.now()
            };

            const arrHistory = [
                entry,
                ...ajaxHistory
            ];

            setAjaxHistory(arrHistory);

            (async () => {
                const [err, response] = await p;
                const jsonData = response.json;
                const textData = response.text;

                setAjaxHistory((prevState) => {
                    const clonedState = structuredClone(prevState);
                    clonedState.some((item) => {
                        if (item.uuid === entry.uuid) {
                            if (err) {
                                item.err = {
                                    message: err.message,
                                    stack: err.stack
                                };
                            }
                            if (jsonData) {
                                item.jsonData = jsonData;
                            }
                            if (textData) {
                                item.textData = textData;
                            }
                            item.completedAt = Date.now();
                            return true;
                        }
                        return false;
                    });

                    return clonedState;
                });
            })();

            const querifiedP = safeArrayPromiseToErrorPromise(p);
            return querifiedP;
        }
    });

    const handleValueChange = function (evt) {
        const value = evt.target.value;

        for (const optgroup of ajaxRequestConfigs) {
            for (const option of optgroup.options) {
                if (option.id === value) {
                    setTheRequestMethod(option.method || 'GET');
                    setSelectedAjaxUrl(value);

                    setRequestConfig(option);
                    setTypedValueForUrl(option.defaultUrl || option.url);
                    setProvidedParameters(option.form?.formData || {});

                    return;
                }
            }
        }
    };

    return (
        <div className="AjaxRequest">
            <div style={{ display: canHoldInputElementsInRow ? 'flex' : null }}>
                <div>
                    <select
                        value={selectedAjaxUrl}
                        onChange={handleValueChange}
                        style={{
                            width: canHoldInputElementsInRow ? undefined : '100%',
                            maxWidth: '100%',
                            height: 28
                        }}
                    >
                        <option value="none">
                            -- Select an AJAX request --
                        </option>
                        {
                            ajaxRequestConfigs.map((optgroup, index) => {
                                const {
                                    label,
                                    options
                                } = optgroup;
                                return (
                                    <optgroup key={index} label={label}>
                                        {options.map((entry, index) => {
                                            return (
                                                <option key={index} value={entry.id}>
                                                    {entry.title || entry.id}
                                                </option>
                                            );
                                        })}
                                    </optgroup>
                                );
                            })
                        }
                    </select>
                </div>
                <div
                    style={{
                        flex: 1,
                        marginLeft: canHoldInputElementsInRow ? 15 : undefined,
                        marginTop: canHoldInputElementsInRow ? undefined : 10
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <div>
                            <select
                                value={theRequestMethod}
                                onChange={(evt) => setTheRequestMethod(evt.target.value)}
                                style={{
                                    height: 28,
                                    fontFamily: 'monospace',
                                    minWidth: 70,
                                    textAlignLast: 'center', // Center align only the unopened part of the select box
                                    fieldSizing: 'content'
                                }}
                            >
                                <optgroup label="Common">
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                </optgroup>
                                <optgroup label="Others">
                                    <option value="PUT">PUT</option>
                                    <option value="PATCH">PATCH</option>
                                    <option value="DELETE">DELETE</option>
                                    <option value="HEAD">HEAD</option>
                                </optgroup>
                            </select>
                        </div>
                        <div style={{ flex: 1, marginLeft: 15 }}>
                            <input
                                type="text"
                                spellCheck="false"
                                placeholder="AJAX Request URL"
                                value={typedValueForUrl}
                                style={{
                                    width: '100%',
                                    padding: 5,
                                    height: 28,
                                    fontFamily: 'monospace'
                                }}
                                onChange={function (evt) {
                                    setTypedValueForUrl(evt.target.value);
                                }}
                                onKeyDown={function (evt) {
                                    if (evt.key === 'Enter') {
                                        setRequestedUrl(typedValueForUrl);
                                        refetch();
                                    }
                                }}
                                onFocus={function (evt) {
                                    // If the current value matches a pattern like: '/abc/{pattern}/xyz', then select the
                                    // part within the first set of curly braces (including the curly braces).
                                    const value = evt.target.value;
                                    const matches = value.match(/{[^{}]+}/);
                                    if (matches) {
                                        evt.target.setSelectionRange(matches.index, matches.index + matches[0].length);
                                    } else {
                                        evt.target.select();
                                    }
                                }}
                            />
                        </div>
                        {
                            !canHoldInputElementsInRow &&
                            <ResetUrl
                                canHoldInputElementsInRow={canHoldInputElementsInRow}
                                requestConfig={requestConfig}
                                setTypedValueForUrl={setTypedValueForUrl}
                            />
                        }
                    </div>
                    {
                        requestConfig?.form &&
                        <div
                            style={{
                                marginTop: 10,
                                display: 'flex',
                                justifyContent: 'center',

                                background: 'linear-gradient(90deg, #fff, #eee 50%, #fff)',

                                padding: 10
                            }}
                        >
                            <BuildForm
                                requestConfig={requestConfig}
                                onFormChange={({
                                    formData,
                                    result, // eslint-disable-line no-unused-vars
                                    formChangeId // eslint-disable-line no-unused-vars
                                }) => {
                                    if (theRequestMethod === 'GET') {
                                        let url = requestConfig.url;

                                        const searchParams = new URLSearchParams();
                                        for (const key in formData) {
                                            if (
                                                formData[key] !== undefined &&
                                                formData[key] !== ''
                                            ) {
                                                searchParams.set(key, formData[key]);
                                            }
                                        }
                                        const searchParamsString = searchParams.toString();
                                        if (searchParamsString !== '') {
                                            url += `?${searchParamsString}`;
                                        }

                                        setTypedValueForUrl(url);
                                    } else {
                                        setProvidedParameters(formData);
                                    }
                                }}
                            />
                        </div>
                    }
                </div>
                {
                    canHoldInputElementsInRow &&
                    <ResetUrl
                        canHoldInputElementsInRow={canHoldInputElementsInRow}
                        requestConfig={requestConfig}
                        setTypedValueForUrl={setTypedValueForUrl}
                    />
                }
                <div
                    style={{
                        marginLeft: canHoldInputElementsInRow ? 15 : undefined,
                        marginTop: canHoldInputElementsInRow ? undefined : 10,
                        textAlign: 'center'
                    }}
                >
                    <Button
                        type="button"
                        variant="contained"
                        size="small"
                        disabled={typedValueForUrl === 'none' || typedValueForUrl === ''}
                        onClick={() => {
                            setRequestedUrl(typedValueForUrl);
                            refetch();
                        }}
                        style={{ height: 28 }}
                    >
                        Make request
                    </Button>
                </div>
            </div>
            {
                requestedUrl !== '' &&
                <div style={{ marginTop: 10 }}>
                    {
                        ajaxHistory.map((entry) => {
                            const {
                                uuid,
                                err,
                                url: requestedUrl,
                                jsonData,
                                textData,
                                initiatedAt,
                                completedAt
                            } = entry;

                            const timeDiff = (
                                (completedAt && initiatedAt) ?
                                    `${(completedAt - initiatedAt)} ms` :
                                    '...'
                            );
                            const header = (
                                <span title={`${initiatedAt} - ${completedAt}`} style={{ fontFamily: 'monospace' }}>
                                    {`${timeDiff} => ${requestedUrl}`}
                                </span>
                            );

                            const extra = (
                                <div
                                    onClick={() => {
                                        let clonedState = structuredClone(ajaxHistory);
                                        clonedState = clonedState.filter((item) => {
                                            if (item.uuid === uuid) {
                                                return false;
                                            }
                                            return true;
                                        });
                                        setAjaxHistory(clonedState);
                                    }}
                                >
                                    <CloseIcon style={{ display: 'flex' }} />
                                </div>
                            );
                            return (
                                <Collapse
                                    key={uuid}
                                    defaultActiveKey="0"
                                    items={[
                                        {
                                            label: header,
                                            extra,
                                            children: (
                                                <div>
                                                    {(function () {
                                                        if (err) {
                                                            return (
                                                                <div style={{ marginTop: 5, fontWeight: 'bold', color: 'red' }}>
                                                                    Error: {err.message}
                                                                </div>
                                                            );
                                                        } else if (textData) {
                                                            return (
                                                                <div>
                                                                    <ViewCode
                                                                        type={jsonData ? 'json' : 'text'}
                                                                        json={jsonData}
                                                                        textData={textData}
                                                                        style={{
                                                                            paddingLeft: 16,
                                                                            paddingRight: 16
                                                                        }}
                                                                        panelStyle={{
                                                                            marginTop: 10,
                                                                            marginBottom: 10,
                                                                            paddingLeft: 20
                                                                        }}
                                                                        directLink={{
                                                                            href: requestedUrl
                                                                        }}
                                                                    />
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div>
                                                                    <Loading type="line-scale" />
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            )
                                        }
                                    ]}
                                />
                            );
                        })
                    }
                </div>
            }
        </div>
    );
};

export { AjaxRequest };
