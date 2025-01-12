import React from 'react';
import { createRoot } from 'react-dom/client';

import 'styles-reset/styles-reset.css';

import './admin.css';

import { Admin } from './Admin/Admin.js';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../common/queryClient/queryClient.js';

import { PageWidgets } from './Admin/PageWidgets/PageWidgets.js';

const AdminApp = function () {
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <div>
                    <Admin />
                </div>
                <PageWidgets />
            </div>
        </QueryClientProvider>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<AdminApp />);
