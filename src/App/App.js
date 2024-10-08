import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../common/queryClient/queryClient.js';

import './App.css';

import { PageHeader } from './PageHeader/PageHeader.js';
import { PageBody } from './PageBody/PageBody.js';
import { PageFooter } from './PageFooter/PageFooter.js';
import { PageWidgets } from './PageWidgets/PageWidgets.js';

const App = function () {
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <PageHeader />
                <PageBody />
                <PageFooter />
                <PageWidgets />
            </div>
        </QueryClientProvider>
    );
};

export { App };
