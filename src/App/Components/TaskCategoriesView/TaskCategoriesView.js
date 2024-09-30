import React from 'react';

import InfoIcon from '@mui/icons-material/Info'; // eslint-disable-line node/file-extension-in-import

import { GenericAccordion } from '../../../base_modules/GenericAccordion/GenericAccordion.js';

import { TaskCategories } from './Components/TaskCategories/TaskCategories.js';

import * as styles from './TaskCategoriesView.css';

const TaskCategoriesView = function () {
    return (
        <div className={styles.TaskCategoriesView}>
            <GenericAccordion
                localStorageIdForExpanded="flagPanelTaskCategoriesView"
                title={<div style={{ lineHeight: '25px' }}>Task Categories</div>}
                icon={<InfoIcon />}
                flagRefreshedAt
                el={({ refreshedAt }) => {
                    return <TaskCategories refreshedAt={refreshedAt} />;
                }}
            />
        </div>
    );
};

export { TaskCategoriesView };
