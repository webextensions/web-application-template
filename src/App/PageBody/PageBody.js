import React from 'react';

import * as styles from './PageBody.css';

import { TaskCategoriesView } from '../Components/TaskCategoriesView/TaskCategoriesView.js';

const PageBody = function () {
    return (
        <div className={styles.PageBody}>
            <div>
                <TaskCategoriesView />
            </div>
        </div>
    );
};

export { PageBody };
