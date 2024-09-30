import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles/index.js';

import BaseAccordion from '@mui/material/Accordion/index.js';
import AccordionSummary from '@mui/material/AccordionSummary/index.js';
import AccordionDetails from '@mui/material/AccordionDetails/index.js';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // eslint-disable-line node/file-extension-in-import
import AutorenewIcon from '@mui/icons-material/Autorenew'; // eslint-disable-line node/file-extension-in-import

import { useLocalStorage } from 'react-use';

const Accordion = styled((props) => (
    <BaseAccordion disableGutters elevation={0} square {...props} />
))(() => ({
    border: `1px solid #b7b7b7`,
    backgroundColor: '#e7e7e7'
}));

const GenericAccordion = function ({
    children,
    el,
    flagRefreshedAt,
    localStorageIdForExpanded,
    localStorageDefaultValueForExpanded,
    title,
    icon
}) {
    let expanded;
    let setExpanded;

    // Note: When consuming this component, ensure that the value for the prop `localStorageIdForExpanded` does not change, so that, the "rules of hooks" are effectively followed.
    if (localStorageIdForExpanded) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [expanded, setExpanded] = useLocalStorage(localStorageIdForExpanded, localStorageDefaultValueForExpanded || 'no');
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [expanded, setExpanded] = useState('no');
    }

    const [initialized, setInitialized] = useState(expanded === 'yes');
    const [refreshedAt, setRefreshedAt] = useState(0);

    let elRender = null;
    if (el) {
        elRender = el({
            refreshedAt
        });
    }
    return (
        <Accordion
            TransitionProps={{
                unmountOnExit: initialized ? false : true
            }}
            expanded={expanded === 'yes'}
            onChange={(evt, expanded) => {
                if (expanded) {
                    setInitialized(true);
                }

                setExpanded(expanded ? 'yes' : 'no');
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {
                    icon &&
                    <div>
                        {icon}
                    </div>
                }
                <div
                    style={{
                        marginLeft: (icon ? 10 : 0)
                    }}
                >
                    {title}
                </div>
                {
                    (flagRefreshedAt && expanded === 'yes') ?
                        (
                            <div
                                style={{ marginLeft: 10, display: 'inherit' }}
                                onClick={(evt) => {
                                    evt.stopPropagation();
                                    setRefreshedAt(Date.now());
                                }}
                            >
                                <AutorenewIcon />
                            </div>
                        ) :
                        null
                }
            </AccordionSummary>
            <AccordionDetails
                style={{
                    backgroundColor: '#fff',
                    borderTop: '1px solid #bbb'
                }}
            >
                <div
                    style={{
                        paddingTop: 8,
                        width: '100%'
                    }}
                >
                    {elRender || children}
                </div>
            </AccordionDetails>
        </Accordion>
    );
};
GenericAccordion.propTypes = {
    children: PropTypes.node,
    el: PropTypes.func,
    flagRefreshedAt: PropTypes.bool,
    localStorageIdForExpanded: PropTypes.string,
    localStorageDefaultValueForExpanded: PropTypes.string,
    title: PropTypes.node.isRequired,
    icon: PropTypes.node
};

export { GenericAccordion };
