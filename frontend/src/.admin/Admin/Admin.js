import React from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

import { GenericAccordion } from '../../base_modules/GenericAccordion/GenericAccordion.js';

import { AjaxRequest } from './Components/AjaxRequest/AjaxRequest.js';
import { CreateUser } from './Components/CreateUser/CreateUser.js';

const Admin = function () {
    return (
        <div>
            <div>
                <GenericAccordion
                    localStorageIdForExpanded="flagPanelAjaxRequest"
                    title={<div style={{ lineHeight: '25px' }}>AJAX Request</div>}
                    icon={<SignalCellularAltIcon />}
                >
                    <AjaxRequest />
                </GenericAccordion>
            </div>
            <div>
                <GenericAccordion
                    localStorageIdForExpanded="flagPanelCreateUser"
                    title={<div style={{ lineHeight: '25px' }}>Create User</div>}
                    icon={<VisibilityIcon />}
                >
                    <CreateUser />
                </GenericAccordion>
            </div>
        </div>
    );
};

export { Admin };
