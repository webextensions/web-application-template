import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Loading } from '../../../../../ImportedComponents/Loading/Loading.js';

import { safeArrayPromiseToErrorPromise } from '../../../../utils/safeArrayPromiseToErrorPromise.js';
import {
    listTaskCategories,
    deleteTaskCategory
} from '../../../../dal.js';

import { useUserUuid } from '../../../../../base_modules/hooks/useUserUuid/useUserUuid.js';

import { AddCategory } from '../AddCategory/AddCategory.js';

import * as styles from './TaskCategories.css';

const DeleteTaskCategory = ({ taskCategoryId, onDelete }) => {
    const { userUuid } = useUserUuid();

    const {
        mutate,
        status,
        isPending
    } = useMutation({
        mutationFn: () => {
            const p = deleteTaskCategory({ userUuid, taskCategoryId });
            const querifiedP = safeArrayPromiseToErrorPromise(p);
            return querifiedP;
        }
    });

    if (status === 'success') {
        return <div>Deleted</div>;
    }
    return (
        <button
            disabled={isPending}
            onClick={async () => {
                await mutate();
                onDelete();
            }}
        >
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    );
};
DeleteTaskCategory.propTypes = {
    taskCategoryId: propTypes.string,
    onDelete: propTypes.func
};

const TaskCategory = ({ taskCategory }) => {
    const [deleted, setDeleted] = useState(false);
    const handleDelete = () => {
        setDeleted(true);
    };
    return (
        <tr
            style={{
                height: 24,
                cursor: deleted ? 'not-allowed' : 'pointer',
                opacity: deleted ? 0.5 : undefined
            }}
        >
            <td className="column-width-auto">{taskCategory.title}</td>
            <td className="column-width-min">{taskCategory.createdAt}</td>
            <td className="column-width-min">
                <DeleteTaskCategory taskCategoryId={taskCategory.id} onDelete={handleDelete} />
            </td>
        </tr>
    );
};
TaskCategory.propTypes = {
    taskCategory: propTypes.object
};

const TaskCategoriesTable = ({ taskCategories }) => {
    if (!taskCategories.length) {
        return (
            <div style={{ fontStyle: 'italic', color: '#777' }}>
                There are no available task categories. Please add a task category.
            </div>
        );
    }

    return (
        <table style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th className="column-width-auto">Title</th>
                    <th className="column-width-min">Created At</th>
                    <th className="column-width-min">Actions</th>
                </tr>
            </thead>
            <tbody>
                {taskCategories.map((taskCategory) => {
                    return <TaskCategory taskCategory={taskCategory} key={taskCategory.id} />;
                })}
            </tbody>
        </table>
    );
};
TaskCategoriesTable.propTypes = {
    taskCategories: propTypes.array
};

const TaskCategoriesList = ({ refreshedAt }) => {
    const { userUuid } = useUserUuid();
    const {
        status,
        fetchStatus,
        data
    } = useQuery({
        queryKey: ['taskCategoriesList'],
        queryFn: () => {
            const p = listTaskCategories({ userUuid });
            const querifiedP = safeArrayPromiseToErrorPromise(p);
            return querifiedP;
        }
    });

    const queryClient = useQueryClient();
    useEffect(() => {
        if (refreshedAt) {
            queryClient.invalidateQueries({
                queryKey: ['taskCategoriesList'],
                exact: true
            });
        }
    }, [refreshedAt]);

    return (
        <div
            style={{
                opacity: (fetchStatus === 'fetching') ? 0.5 : undefined,
                transition: (fetchStatus === 'fetching') ? undefined : 'opacity 0.3s',
                overflow: 'auto'
            }}
        >
            {(() => {
                if (status === 'success') {
                    return <TaskCategoriesTable taskCategories={data} />;
                } else if (status === 'error') {
                    return 'Error';
                } else {
                    return <Loading type="line-scale" />;
                }
            })()}
        </div>
    );
};
TaskCategoriesList.propTypes = {
    refreshedAt: propTypes.number
};

const TaskCategories = function ({ refreshedAt }) {
    return (
        <div className={styles.TaskCategories}>
            <TaskCategoriesList refreshedAt={refreshedAt} />

            <div style={{ marginTop: 20 }}>
                <AddCategory />
            </div>
        </div>
    );
};
TaskCategories.propTypes = {
    refreshedAt: propTypes.number
};

export { TaskCategories };
