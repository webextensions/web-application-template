import React, { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '../../../../../ImportedComponents/react-toastify.js';

import { errAndDataArrayToPromise } from '../../../../utils/errAndDataArrayToPromise.js';

import { createTaskCategory } from '../../../../dal.js';

import * as styles from './AddCategory.css';

const AddCategory = function () {
    const [title, setTitle] = useState('');

    const queryClient = useQueryClient();

    const {
        isLoading,
        mutate
    } = useMutation({
        mutationFn: function () {
            const p = errAndDataArrayToPromise(createTaskCategory, [title]);
            const cachedTitle = title;
            (async function () {
                try {
                    await p;
                    // TODO: HARDCODING: Get rid of this hardcoding ('taskCategoriesList')
                    queryClient.invalidateQueries(['taskCategoriesList']);
                    setTitle('');
                    toast.success('Category added successfully');
                } catch (error) {
                    const httpResponseStatus = error?.response?.status;
                    if (httpResponseStatus === 409) {
                        toast.error(`Error - Category "${cachedTitle}" already exists`);
                    } else {
                        toast.error(`Error - Failed to add category "${cachedTitle}"`);
                    }
                }
            }());
            return p;
        }
    });

    return (
        <div className={styles.AddCategory}>
            <div>
                <input
                    type="text"
                    placeholder="Provide the category to be added"
                    style={{ width: '80vw' }}
                    value={title}
                    onChange={function (e) {
                        setTitle(e.target.value);
                    }}
                    onKeyPress={function (e) {
                        if (
                            e.key === 'Enter' &&
                            !isLoading &&
                            title
                        ) {
                            mutate();
                        }
                    }}
                />
            </div>
            <div>
                <button
                    type="button"
                    disabled={isLoading || !title}
                    onClick={function () {
                        mutate();
                    }}
                >
                    {isLoading ? 'Adding...' : 'Add'}
                </button>
            </div>
        </div>
    );
};

export { AddCategory };
