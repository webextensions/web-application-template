import React, { useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-toastify';

import { userObjectFrontendSchema } from '../../../../../../backend/src/database/AppDal/Users/UsersFieldsSchema.js';

import { LoadingErrorLoaded } from '../../../../base_modules/LoadingErrorLoaded/LoadingErrorLoaded.js';

import { safeArrayPromiseToErrorPromise } from '../../../../App/utils/safeArrayPromiseToErrorPromise.js';

import { createUser } from '../../../base_modules/adminDal/adminDal.js';

const CreateUser = function () {
    const [id, setId] = useState('abc');
    const [name, setName] = useState('Abc Xyz');
    const [email, setEmail] = useState('mail@example.com');
    const [password, setPassword] = useState('123456');
    const [joinedAt, setJoinedAt] = useState(Date.now());

    const queryClient = useQueryClient();

    const {
        status,
        fetchStatus,
        error,
        data,
        refetch
    } = useQuery({
        enabled: false,
        queryKey: ['createUser'],
        queryFn: () => {
            const p = createUser({
                id,
                name,
                email,
                password,
                joinedAt
            });
            const querifiedP = safeArrayPromiseToErrorPromise(p);
            return querifiedP;
        }
    });

    const handleSubmit = async () => {
        try {
            const userOb = { id, name, email, password, joinedAt };
            userObjectFrontendSchema.parse(userOb);
        } catch (e) {
            console.error(e);
            toast.error(e.message);
            return;
        }
        queryClient.removeQueries({
            queryKey: ['createUser'],
            exact: true
        });
        await refetch();
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </div>
            <div style={{ marginTop: 5 }}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div style={{ marginTop: 5 }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div style={{ marginTop: 5 }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div style={{ marginTop: 5 }}>
                <input
                    type="number"
                    placeholder="Joined At"
                    value={joinedAt}
                    onChange={(e) => setJoinedAt(e.target.value)}
                />
            </div>
            <div style={{ marginTop: 10 }}>
                <button
                    type="button"
                    onClick={handleSubmit}
                >
                    Create
                </button>
            </div>
            <div style={{ marginTop: 5 }}>
                <LoadingErrorLoaded
                    status={status}
                    fetchStatus={fetchStatus}
                    error={error}
                    data={data}
                    showRawData="as-tooltip"
                />
            </div>
        </div>
    );
};

export { CreateUser };
