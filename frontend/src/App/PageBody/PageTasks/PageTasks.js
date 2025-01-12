import React from 'react';

import { EnsureLogin } from '../../Components/EnsureLogin/EnsureLogin.js';

import { TaskCategoriesView } from '../../Components/TaskCategoriesView/TaskCategoriesView.js';

import * as styles from './PageTasks.css';

const PageTasks = () => {
    return (
        <EnsureLogin>
            <div className={styles.PageTasks}>
                <TaskCategoriesView />
            </div>
        </EnsureLogin>
    );
};

export { PageTasks };
