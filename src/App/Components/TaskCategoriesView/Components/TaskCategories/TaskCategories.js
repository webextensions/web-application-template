import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Loading } from '../../../../../ImportedComponents/Loading/Loading.js';

import { errAndDataArrayToPromise } from '../../../../utils/errAndDataArrayToPromise.js';
import {
    listTaskCategories,
    deleteTaskCategory
} from '../../../../dal.js';

import { AddCategory } from '../AddCategory/AddCategory.js';

const DeleteTaskCategory = ({ taskCategoryId, onDelete }) => {
    const {
        mutate,
        status,
        isPending
    } = useMutation({
        mutationFn: () => {
            const p = errAndDataArrayToPromise(deleteTaskCategory, [taskCategoryId]);
            return p;
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
            <td>{taskCategory.title}</td>
            <td>{taskCategory.createdAt}</td>
            <td>
                <DeleteTaskCategory taskCategoryId={taskCategory._id} onDelete={handleDelete} />
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
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {taskCategories.map((taskCategory) => {
                    return <TaskCategory taskCategory={taskCategory} key={taskCategory._id} />;
                })}
            </tbody>
        </table>
    );
};
TaskCategoriesTable.propTypes = {
    taskCategories: propTypes.array
};

const TaskCategoriesList = ({ refreshedAt }) => {
    const {
        status,
        fetchStatus,
        data
    } = useQuery({
        queryKey: ['taskCategoriesList'],
        queryFn: () => {
            const p = errAndDataArrayToPromise(listTaskCategories);
            return p;
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
                transition: (fetchStatus === 'fetching') ? undefined : 'opacity 0.3s'
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
        <div>
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
