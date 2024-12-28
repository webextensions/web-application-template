import React from 'react';

import Button from '@mui/material/Button/index.js';

import * as styles from './SignInForm.css';

const SignInForm = function () {
    return (
        <div className={styles.SignInForm}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Sign In</div>

            <form style={{ marginTop: 20 }}>
                <div>
                    <input
                        type="text"
                        id="accountId"
                        name="accountId"
                        placeholder="Account ID"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled
                    >
                        Sign In
                    </Button>
                </div>
            </form>
        </div>
    );
};

export { SignInForm };
