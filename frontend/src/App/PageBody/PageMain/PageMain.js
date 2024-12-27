import React from 'react';

import { TaskCategoriesView } from '../../Components/TaskCategoriesView/TaskCategoriesView.js';
import { Demo } from '../../Components/Demo/Demo.js';

import * as styles from './PageMain.css';

const PageMain = function () {
    return (
        <div className={styles.PageMain}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20
                }}
            >
                <TaskCategoriesView />
                <Demo />
            </div>
        </div>
    );
};

export { PageMain };
