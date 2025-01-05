import React, { useRef } from 'react';

import PropTypes from 'prop-types';

import Button from '@mui/material/Button/index.js';
import Dialog from '@mui/material/Dialog/index.js';
import DialogContent from '@mui/material/DialogContent/index.js';
import DialogTitle from '@mui/material/DialogTitle/index.js';
import useMediaQuery from '@mui/material/useMediaQuery/index.js';
import { useTheme } from '@mui/material/styles/index.js';
import IconButton from '@mui/material/IconButton/index.js';
import CloseIcon from '@mui/icons-material/Close';

import Paper from '@mui/material/Paper/index.js';
import Draggable from 'react-draggable';

import * as styles from './ResponsiveDialog.css';

function PaperComponent(props) {
    const nodeRef = useRef(null);
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
            // `nodeRef` is required to prevent a warning / potential-future-issue related to the fact that
            // ReactDOM.findDOMNode() is deprecated.
            // Ref: https://github.com/react-grid-layout/react-draggable/commit/002671fb5aac42b94973a549a17d168b5fb587dc
            nodeRef={nodeRef}
        >
            <Paper ref={nodeRef} {...props} />
        </Draggable>
    );
}

const DialogTitleWithClose = (props) => {
    const { children } = props;
    const { draggable } = props;
    return (
        <DialogTitle
            className="ResponsiveDialogTitle"
            id={draggable ? 'draggable-dialog-title' : undefined}
            style={{ cursor: draggable ? 'move' : undefined }}
        >
            <div>{children}</div>
        </DialogTitle>
    );
};

DialogTitleWithClose.propTypes = {
    children: PropTypes.node.isRequired,
    draggable: PropTypes.bool
};

function ResponsiveDialog(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    let closable = true;
    if (props.closable === false) {
        closable = false;
    }

    const { title } = props;

    const { noPrimaryButton } = props;
    const showPrimaryButton = !noPrimaryButton;

    let primaryButtonDisabled = false;
    if (props.primaryButtonDisabled === true) {
        primaryButtonDisabled = true;
    }

    const { draggable } = props;

    const computedDraggable = (draggable && !fullScreen);

    return (
        <div className={styles.ResponsiveDialog}>
            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={props.onClose}
                // disableEnforceFocus={true} // DEV-HELPER Useful while using other tools which may need focus

                PaperComponent={computedDraggable ? PaperComponent : undefined}

                // // Removed in MUI v5
                // // https://mui.com/guides/migration-v4/#modal
                // // https://stackoverflow.com/questions/69991556/mui-v5-disablebackdropclick-in-createtheme-equivalent/69992442#69992442
                // disableBackdropClick={props.disableBackdropClick}
            >
                <DialogTitleWithClose draggable={computedDraggable} onClose={props.onClose}>
                    <div style={{ display: 'flex' }}>
                        {
                            closable &&
                            <div>
                                <IconButton
                                    size="small"
                                    onClick={props.onClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        }
                        {
                            title &&
                            <div style={{ marginLeft: 20 }}>
                                {title}
                            </div>
                        }
                        {
                            showPrimaryButton &&
                            <div style={{ marginLeft: 'auto' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={props.primaryButtonOnClick}
                                    disabled={primaryButtonDisabled}
                                >
                                    {props.primaryButtonText || 'OK'}
                                </Button>
                            </div>
                        }
                    </div>
                </DialogTitleWithClose>
                <DialogContent style={{ marginBottom: 16 }}>
                    {props.children}
                </DialogContent>
            </Dialog>
        </div>
    );
}
ResponsiveDialog.propTypes = {
    draggable: PropTypes.bool,
    open: PropTypes.bool.isRequired,
    closable: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    disableBackdropClick: PropTypes.bool,
    title: PropTypes.string,
    noPrimaryButton: PropTypes.bool,
    primaryButtonOnClick: PropTypes.func,
    primaryButtonDisabled: PropTypes.bool,
    primaryButtonText: PropTypes.string,
    children: PropTypes.node.isRequired
};

export { ResponsiveDialog };
