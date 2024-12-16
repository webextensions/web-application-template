import React from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';

import { GenericAccordion } from '../../base_modules/GenericAccordion/GenericAccordion.js';

import { CreateUser } from './Components/CreateUser/CreateUser.js';

const Admin = function () {
    return (
        <div>
            <GenericAccordion
                localStorageIdForExpanded="flagPanelCreateUser"
                title={<div style={{ lineHeight: '25px' }}>Create User</div>}
                icon={<VisibilityIcon />}
            >
                <CreateUser />
            </GenericAccordion>
        </div>
    );
};

export { Admin };
