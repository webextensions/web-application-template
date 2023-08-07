import React from 'react';

import './App.css';

import { PageHeader } from './PageHeader/PageHeader.js';
import { PageBody } from './PageBody/PageBody.js';
import { TodoList } from './TodoList/TodoList.js';
import { Dashboard } from './Dashboard/Dashboard.js';
import { PageFooter } from './PageFooter/PageFooter.js';

const App = function () {
    return (
        <div>
            <PageHeader />
            <PageBody />
            <TodoList />
            <div>
                <Dashboard />
            </div>
            <br />
            <PageFooter />
        </div>
    );
};

export { App };
