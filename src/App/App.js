import React from 'react';

import './App.css';

import PageHeader from './PageHeader/PageHeader.js';
import TodoList from './TodoList/TodoList.js';
import PageFooter from './PageFooter/PageFooter.js';

class App extends React.Component {
    render() {
        return (
            <div>
                <PageHeader />
                <TodoList />
                <br />
                <PageFooter />
            </div>
        );
    }
}

export default App;
