import React, { useState } from 'react';

import ky from 'ky';

import 'rc-collapse/assets/index.css';
import Collapse from 'rc-collapse';

import CloseIcon from '@mui/icons-material/Close';

import { useMediaQuery } from 'react-responsive';

import { randomUUID } from 'helpmate/dist/uuid/randomUUID.js';

import { useQuery } from '@tanstack/react-query';

import { Loading } from '../../../../ImportedComponents/Loading/Loading.js';

import { ViewCode } from '../../../base_modules/ViewCode/ViewCode.js';

import { safeArrayPromiseToErrorPromise } from '../../../../App/utils/safeArrayPromiseToErrorPromise.js';

import './AjaxRequest.css';

const ajaxRequestConfigs = [
    {
        label: 'Admin',
        options: [
            {
                text: 'Help (Routes)',
                url: '/admin/help?format=json'
            },
            {
                text: 'Help (Routes)',
                url: '/admin/help?format=json'
            },
            {
                text: 'Info',
                url: '/admin/info'
            },
            {
                text: 'Kill server instance',
                url: '/admin/kill'
            },
            {
                text: 'Setup database',
                url: '/admin/setupDb'
            }
        ]
    },
    {
        label: 'Admin - Users list',
        options: [
            {
                text: 'List all users',
                url: '/admin/users/list'
            }
        ]
    },
    {
        label: 'General',
        options: [
            {

                text: 'List all task categories',
                url: 'http://localhost:8000/taskCategories/list'
            }
        ]
    }
];

const getUrlAndParse = async function (url) {
    try {
        const text = await ky.get(url, { retry: 0 }).text();

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

    const [ajaxHistory, setAjaxHistory] = useState([]);

    const { refetch } = useQuery({
        enabled: false,
        queryKey: ['ajaxHistory'],
        queryFn: () => {
            const url = typedValueForUrl;

            const p = getUrlAndParse(url);

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

    return (
        <div className="AjaxRequest">
            <div style={{ display: canHoldInputElementsInRow ? 'flex' : null }}>
                <div>
                    <select
                        value={selectedAjaxUrl}
                        onChange={(evt) => {
                            setSelectedAjaxUrl(evt.target.value);
                            setTypedValueForUrl(evt.target.value);
                        }}
                        style={{
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
                                                <option key={index} value={entry.url}>
                                                    {entry.text}
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
                    <input
                        type="text"
                        spellCheck="false"
                        placeholder="AJAX Request URL"
                        value={typedValueForUrl}
                        onChange={function (evt) {
                            setTypedValueForUrl(evt.target.value);
                        }}
                        style={{
                            width: '100%',
                            height: 28
                        }}
                    />
                </div>
                <div
                    style={
                        canHoldInputElementsInRow ? { marginLeft: 15 } : { marginTop: 10 }
                    }
                >
                    <button
                        type="button"
                        disabled={typedValueForUrl === 'none' || typedValueForUrl === ''}
                        onClick={() => {
                            setRequestedUrl(typedValueForUrl);
                            refetch();
                        }}
                        style={{ height: 28 }}
                    >
                        Make request
                    </button>
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
