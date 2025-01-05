import React from 'react';

import { BrowserRouter } from 'react-router';

import { QueryClientProvider } from '@tanstack/react-query';

import { Provider } from 'jotai';

import { queryClient } from '../common/queryClient/queryClient.js';

import { jotaiStore } from './store/jotaiStore.js';

import 'styles-reset/styles-reset.css';
import 'utility-classes.css/utility-classes.css';

import './App.css';

import { DevCustomizationsSetup } from './Dev/DevCustomizations/DevCustomizationsSetup.js';

import { LayoutAbsoluteFullWidth } from '../Layout/Layout.js';

import { PageHeader } from './PageHeader/PageHeader.js';
import { PageBody } from './PageBody/PageBody.js';
import { PageFooter } from './PageFooter/PageFooter.js';
import { PageWidgets } from './PageWidgets/PageWidgets.js';

const App = function () {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={jotaiStore}>
                <BrowserRouter>
                    <DevCustomizationsSetup />
                    <div>
                        <div>
                            <LayoutAbsoluteFullWidth
                                style={{
                                    backgroundColor: '#fff'
                                }}
                            >
                                <PageHeader />
                            </LayoutAbsoluteFullWidth>
                        </div>

                        <div>
                            <LayoutAbsoluteFullWidth
                                style={{
                                    paddingTop: 65,
                                    paddingBottom: 65,
                                    backgroundColor: '#fff'
                                }}
                            >
                                <PageBody />
                            </LayoutAbsoluteFullWidth>
                        </div>

                        <div>
                            <LayoutAbsoluteFullWidth
                                style={{
                                    paddingTop: 25,
                                    paddingBottom: 50
                                }}
                            >
                                <PageFooter />
                            </LayoutAbsoluteFullWidth>
                        </div>

                        <PageWidgets />
                    </div>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    );
};

export { App };
