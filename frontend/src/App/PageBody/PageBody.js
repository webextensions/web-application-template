import React from 'react';

import * as styles from './PageBody.css';

import { TaskCategoriesView } from '../Components/TaskCategoriesView/TaskCategoriesView.js';
import { Demo } from '../Components/Demo/Demo.js';

const PageBody = function () {
    return (
        <div className={styles.PageBody}>
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

export { PageBody };
