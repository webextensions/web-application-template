import React from 'react';

import { useMinHeight } from '@webextensions/react/hooks/useMinHeight/useMinHeight.js';

import { EnsureLogin } from '../../Components/EnsureLogin/EnsureLogin.js';

import { TaskCategoriesView } from '../../Components/TaskCategoriesView/TaskCategoriesView.js';

import * as styles from './PageTasks.css';

const PageTasks = () => {
    const { ref, removeMinHeight } = useMinHeight({ key: 'page-tasks' });

    return (
        <div ref={ref}>
            <EnsureLogin onLoadingDone={removeMinHeight}>
                <div className={styles.PageTasks}>
                    <TaskCategoriesView />
                </div>
            </EnsureLogin>
        </div>
    );
};

export { PageTasks };
