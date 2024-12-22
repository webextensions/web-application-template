import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Tabs from '@mui/material/Tabs/index.js';
import Tab from '@mui/material/Tab/index.js';
import Button from '@mui/material/Button/index.js';
import Checkbox from '@mui/material/Checkbox/index.js';
import FormControlLabel from '@mui/material/FormControlLabel/index.js';
import TextareaAutosize from '@mui/material/TextareaAutosize/index.js';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { ObjectInspector } from 'react-inspector';
import { Highlight, themes } from 'prism-react-renderer';
import { useHotkeys } from 'react-hotkeys-hook';

import { useLocalStorage } from '@webextensions/react/hooks/useLocalStorage/useLocalStorage.js';

import * as styles from './ViewCode.css';

function TabPanel(props) {
    const { children, value, index, style, ...other } = props;

    const [hasBeenRendered, setHasBeenRendered] = useState(false);

    useEffect(() => {
        if (value === index) {
            setHasBeenRendered(true);
        }
    }, [value, index]);

    return (
        <div
            style={{
                visibility: value !== index ? 'hidden' : undefined,
                display: value !== index ? 'none' : undefined,
                ...style
            }}
            {...other}
        >
            {hasBeenRendered ? children : null}
            {/* {value === index ? children : null} */}
            {/* {children} */}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    style: PropTypes.object
};

const CodeTextarea = function (props) {
    const {
        textData,
        json,
        format,
        rawViewHeight
    } = props;

    let jsonAsString;
    if (format) {
        jsonAsString = JSON.stringify(json, null, '    ');
    } else {
        jsonAsString = textData;
    }

    return (
        <TextareaAutosize
            readOnly
            value={jsonAsString}
            style={{
                display: 'block',
                border: 'none',
                width: '100%',
                maxHeight: rawViewHeight,
                fontSize: 12,
                padding: 0,
                overflow: 'auto'
            }}
        />
    );
};
CodeTextarea.propTypes = {
    textData: PropTypes.string.isRequired,
    json: PropTypes.object,
    format: PropTypes.bool,
    rawViewHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

const CodeHighlighted = function (props) {
    const {
        textData,
        json,
        format,
        rawViewHeight
    } = props;

    const ref = React.useRef(null);

    useHotkeys('ctrl+a, command+a', (evt) => {
        const dom = ref.current;

        // https://stackoverflow.com/questions/6139107/programmatically-select-text-in-a-contenteditable-html-element/6150060#6150060
        const range = document.createRange();
        range.selectNodeContents(dom);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Required to prevent the default 'Select All' behavior of 'ctrl+a'
        evt.preventDefault();
    });

    let jsonAsString;
    if (format) {
        jsonAsString = JSON.stringify(json, null, '    ');
    } else {
        jsonAsString = textData;
    }

    return (
        <Highlight theme={themes.vsLight} code={jsonAsString || ''} language="jsx">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre ref={ref} className={className} style={{ maxHeight: rawViewHeight, overflow: 'auto', cursor: 'text', ...style }}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};
CodeHighlighted.propTypes = {
    textData: PropTypes.string.isRequired,
    json: PropTypes.object,
    format: PropTypes.bool,
    rawViewHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

const CodeRaw = React.memo(function (props) {
    const {
        textData,
        json,
        rawViewHeight
    } = props;

    const [syntaxHighlightingViewCodeTab, setSyntaxHighlightingViewCodeTab] = useLocalStorage('flagSyntaxHighlightingViewCodeTab', 'yes');
    const [flagSyntaxHighlighting, setFlagSyntaxHighlighting] = React.useState(syntaxHighlightingViewCodeTab === 'yes');

    const [formatJsonViewCodeTab, setFormatJsonViewCodeTab] = useLocalStorage('flagFormatViewCodeTab', 'yes');
    const [flagFormat, setFlagFormat] = React.useState(formatJsonViewCodeTab === 'yes');

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={flagSyntaxHighlighting}
                                onChange={function (evt, checked) {
                                    // Using a "setTimeout" because for large contents, it might take time for rendering the
                                    // updated view. With this delay, we let the checkbox render the updated
                                    // "checked"/"unchecked" state before we initiate the heavy render update.
                                    setTimeout(() => {
                                        setFlagSyntaxHighlighting(checked);
                                        setSyntaxHighlightingViewCodeTab(checked ? 'yes' : 'no');
                                    });
                                }}
                            />
                        }
                        label="Use syntax highlighting"
                    />
                </div>
                {
                    json &&
                    <div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={flagFormat}
                                    onChange={function (evt, checked) {
                                        // Using a "setTimeout" because for large contents, it might take time for rendering the
                                        // updated view. With this delay, we let the checkbox render the updated
                                        // "checked"/"unchecked" state before we initiate the heavy render update.
                                        setTimeout(() => {
                                            setFlagFormat(checked);
                                            setFormatJsonViewCodeTab(checked ? 'yes' : 'no');
                                        });
                                    }}
                                />
                            }
                            label="Format JSON"
                        />
                    </div>
                }
            </div>
            <React.Fragment>
                {
                    flagSyntaxHighlighting &&
                    <CodeHighlighted textData={textData} json={json} format={json && flagFormat} rawViewHeight={rawViewHeight} />
                }
                {
                    !flagSyntaxHighlighting &&
                    <CodeTextarea textData={textData} json={json} format={json && flagFormat} rawViewHeight={rawViewHeight} />
                }
            </React.Fragment>
        </div>
    );
});
CodeRaw.displayName = 'CodeRaw';
CodeRaw.propTypes = {
    textData: PropTypes.string.isRequired,
    json: PropTypes.object,
    rawViewHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

const InspectorJson = function (props) {
    const {
        json,
        rawViewHeight,
        sortObjectKeys,
        expandLevel,
        showExpandCollapse
    } = props;

    const [expandLevelByUser, setExpandLevelByUser] = React.useState(expandLevel);
    const [showTree, setShowTree] = React.useState(true);

    return (
        <div>
            {
                showExpandCollapse &&
                <div style={{ display: 'flex', marginTop: 10 }}>
                    <div>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                                setExpandLevelByUser(999);
                            }}
                            style={{
                                textTransform: 'none'
                            }}
                        >
                            Expand all
                        </Button>
                    </div>
                    <div style={{ marginLeft: 10 }}>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                                setShowTree(false);

                                setTimeout(() => {
                                    setExpandLevelByUser(0);

                                    setShowTree(true);
                                });
                            }}
                            style={{
                                textTransform: 'none'
                            }}
                        >
                            Collapse all
                        </Button>
                    </div>
                </div>
            }
            <div style={{ marginTop: 10, maxHeight: rawViewHeight, overflow: 'auto' }}>
                {
                    showTree &&
                    <ObjectInspector
                        data={json}
                        sortObjectKeys={sortObjectKeys}
                        expandLevel={expandLevelByUser}
                    />
                }
            </div>
        </div>
    );
};
InspectorJson.propTypes = {
    json: PropTypes.any.isRequired,
    rawViewHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    sortObjectKeys: PropTypes.bool,
    expandLevel: PropTypes.number,
    showExpandCollapse: PropTypes.bool
};

const ViewCode = function (props) {
    const {
        type,
        textData,
        json,
        sortObjectKeys = true,
        expandLevel = 1,
        style,
        panelStyle,
        directLink,
        showExpandCollapse,
        rawViewHeight = '65vh'
    } = props;

    const [selectedViewCodeTab, setSelectedViewCodeTab] = useLocalStorage('flagViewCodeTab', '0');
    const [value, setValue] = React.useState(
        type === 'text' ? 0 : Number.parseInt(selectedViewCodeTab, 10)
    );

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSelectedViewCodeTab(newValue);
    };

    // const sizeInKb = Math.ceil(JSON.stringify(json).length / 1024);
    const sizeInKb = Math.ceil(textData.length / 1024);
    let sizeInKbColor;
    if (sizeInKb >= 500) {
        sizeInKbColor = 'red';
    } else if (sizeInKb >= 100) {
        sizeInKbColor = 'orange';
    }

    return (
        <div className={styles.ViewCode} style={style}>
            <div style={{ display: 'flex' }}>
                <Tabs value={value} onChange={handleChange}>
                    {
                        type === 'json' &&
                        <Tab label="Preview" />
                    }
                    <Tab
                        label={
                            <span>
                                Raw (<span style={{ color: sizeInKbColor }}>{sizeInKb} kb</span>)
                            </span>
                        }
                    />
                </Tabs>
                {
                    directLink &&
                    <a
                        style={{
                            minWidth: 160,
                            cursor: 'pointer',
                            opacity: 0.7,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            padding: '6px 12px',
                            minHeight: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: '1.75',
                            letterSpacing: '0.02857em',
                            color: 'rgb(51, 51, 51)'
                        }}
                        href={directLink.href}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span
                            style={{
                                marginRight: 10
                            }}
                        >
                            {directLink.linkText || 'Direct link'}
                        </span>
                        <OpenInNewIcon />
                    </a>
                }
            </div>
            {
                type === 'json' &&
                <TabPanel value={value} index={0} style={panelStyle}>
                    <InspectorJson
                        json={json}
                        rawViewHeight={rawViewHeight}
                        sortObjectKeys={sortObjectKeys}
                        expandLevel={expandLevel}
                        showExpandCollapse={showExpandCollapse}
                    />
                </TabPanel>
            }
            <TabPanel value={value} index={type === 'text' ? 0 : 1} style={panelStyle}>
                <CodeRaw
                    json={json}
                    textData={textData}
                    rawViewHeight={rawViewHeight}
                />
            </TabPanel>
        </div>
    );
};

ViewCode.propTypes = {
    type: PropTypes.string,
    textData: PropTypes.string,
    style: PropTypes.object,
    json: PropTypes.any.isRequired,
    sortObjectKeys: PropTypes.bool,
    expandLevel: PropTypes.number,
    panelStyle: PropTypes.object,
    directLink: PropTypes.object,
    showExpandCollapse: PropTypes.bool,
    rawViewHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
};

export { ViewCode };
