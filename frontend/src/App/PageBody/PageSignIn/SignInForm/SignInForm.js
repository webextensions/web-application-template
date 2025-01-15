import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@tanstack/react-query';
import Button from '@mui/material/Button/index.js';
import LoginIcon from '@mui/icons-material/Login';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import FastForwardIcon from '@mui/icons-material/FastForward';

import { toast } from 'react-toastify';

import { loginWithAccountIdAndPassword } from '../../../dal.js';
import { safeArrayPromiseToErrorPromise } from '../../../utils/safeArrayPromiseToErrorPromise.js';

import { useUserUuid } from '../../../../base_modules/hooks/useUserUuid/useUserUuid.js';

import * as styles from './SignInForm.css';

const SignInForm = function ({ redirecting }) {
    const { recomputeUserUuid } = useUserUuid();

    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');

    const {
        status,
        fetchStatus,
        error,
        refetch
    } = useQuery({
        enabled: false,
        queryKey: ['loginWithAccountIdAndPassword'],
        queryFn: () => {
            const p = loginWithAccountIdAndPassword({
                accountId,
                password
            });
            const querifiedP = safeArrayPromiseToErrorPromise(p);
            return querifiedP;
        }
    });

    const noInputYet = !accountId || !password;
    const flagRequestIsOngoing = fetchStatus === 'fetching';

    useEffect(() => {
        if (status === 'success' && fetchStatus === 'idle') {
            recomputeUserUuid();
        }
    }, [status, fetchStatus]);

    useEffect(() => {
        if (error) {
            console.error('Error: Failed to sign in', error);
            toast.error('Error: Failed to sign in');
        }
    }, [error]);

    const handleSubmit = function () {
        refetch();
    };

    return (
        <div className={styles.SignInForm}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Sign In</div>

            <form className={styles.wrapper} style={{ marginTop: 20 }}>
                <div>
                    <input
                        type="text"
                        id="accountId"
                        name="accountId"
                        placeholder="Account ID"
                        value={accountId}
                        onChange={(evt) => {
                            setAccountId(evt.target.value);
                        }}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(evt) => {
                            setPassword(evt.target.value);
                        }}
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    {
                        !redirecting &&
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={noInputYet || flagRequestIsOngoing}
                            startIcon={
                                flagRequestIsOngoing ? <HourglassTopIcon /> : <LoginIcon />
                            }
                            onClick={(evt) => {
                                evt.preventDefault();
                                handleSubmit();
                            }}
                        >
                            Sign In
                        </Button>
                    }
                    {
                        redirecting &&
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={true}
                            startIcon={<FastForwardIcon />}
                        >
                            Redirecting...
                        </Button>
                    }
                </div>
            </form>
        </div>
    );
};
SignInForm.propTypes = {
    redirecting: PropTypes.bool
};

export { SignInForm };
