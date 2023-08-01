import React from 'react';

import styles from './TodoList.css';

import { Todo } from './Todo/Todo.js';

class TodoList extends React.Component {
    render() {
        const dataSet = [
            {
                summary: 'Summary 1 goes here',
                status: 'Done'
            },
            {
                summary: 'Summary 2 goes here',
                status: 'Pending'
            }
        ];
        return (
            <div className={styles.TodoList}>
                {dataSet.map((data, index) => {
                    return <Todo key={index} {...data} />;
                })}
            </div>
        );
    }
}

export { TodoList };
