import React from 'react';

import { BrowserRouter } from 'react-router';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../common/queryClient/queryClient.js';

import 'styles-reset/styles-reset.css';

import './App.css';

import { PageHeader } from './PageHeader/PageHeader.js';
import { PageBody } from './PageBody/PageBody.js';
import { PageFooter } from './PageFooter/PageFooter.js';
import { PageWidgets } from './PageWidgets/PageWidgets.js';

const App = function () {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div>
                    <PageHeader />
                    <PageBody />
                    <div style={{ marginTop: 20 }}>
                        <PageFooter />
                    </div>
                    <PageWidgets />
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export { App };
