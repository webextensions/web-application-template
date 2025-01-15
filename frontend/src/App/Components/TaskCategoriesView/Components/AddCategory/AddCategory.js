import React, { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';

import { safeArrayPromiseToErrorPromise } from '../../../../utils/safeArrayPromiseToErrorPromise.js';

import { createTaskCategory } from '../../../../dal.js';

import { useUserUuid } from '../../../../../base_modules/hooks/useUserUuid/useUserUuid.js';

import * as styles from './AddCategory.css';

const AddCategory = function () {
    const [title, setTitle] = useState('');

    const { userUuid } = useUserUuid();

    const queryClient = useQueryClient();

    const {
        isPending,
        mutate
    } = useMutation({
        mutationFn: function () {
            const p = createTaskCategory({ userUuid, title });
            const cachedTitle = title;
            (async function () {
                const [err] = await p;
                if (err) {
                    const httpResponseStatus = err.response?.status;
                    if (httpResponseStatus === 409) {
                        toast.error(`Error: Category "${cachedTitle}" already exists`);
                    } else {
                        toast.error(`Error: Failed to add category "${cachedTitle}"`);
                    }
                } else {
                    // TODO: HARDCODING: Get rid of this hardcoding ('taskCategoriesList')
                    queryClient.invalidateQueries({
                        queryKey: ['taskCategoriesList'],
                        exact: true
                    });
                    setTitle('');
                    toast.success(`Added category "${cachedTitle}"`);
                }
            }());
            const querifiedP = safeArrayPromiseToErrorPromise(p);
            return querifiedP;
        }
    });

    return (
        <div className={styles.AddCategory}>
            <div style={{ flexGrow: 1 }}>
                <input
                    type="text"
                    placeholder="Provide the category to be added"
                    style={{ width: '100%' }}
                    value={title}
                    onChange={function (e) {
                        setTitle(e.target.value);
                    }}
                    onKeyPress={function (e) {
                        if (
                            e.key === 'Enter' &&
                            !isPending &&
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
                    disabled={isPending || !title}
                    style={{
                        whiteSpace: 'nowrap'
                    }}
                    onClick={function () {
                        mutate();
                    }}
                >
                    {isPending ? 'Adding...' : 'Add'}
                </button>
            </div>
        </div>
    );
};

export { AddCategory };
