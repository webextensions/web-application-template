import React, { useEffect } from 'react';

import { useNavigate } from 'react-router';

import { useAuth } from '../../../base_modules/hooks/useAuth/useAuth.js';

import { ROOT_SIGN_IN } from '../../../../../backend/shared/pages/pageUrls.js';

import { TaskCategoriesView } from '../../Components/TaskCategoriesView/TaskCategoriesView.js';

import * as styles from './PageTasks.css';

const PageTasks = () => {
    const { flagUserIsRegistered } = useAuth();
    const navigate = useNavigate();

    // TODO: FIX-CODE-DUPLICATION: The redirection logic should be handled in a more generic way (Ref: PageAccount.js)
    useEffect(() => {
        if (flagUserIsRegistered === 'no') {
            const theCurrentFullPath = window.location.href.replace(window.location.origin, '');
                  // '/sign-in?successRedirect=/account'
            navigate(`${ROOT_SIGN_IN}?successRedirect=${encodeURIComponent(theCurrentFullPath)}`);
        }
    }, [flagUserIsRegistered]);

    return (
        <div className={styles.PageTasks}>
            <TaskCategoriesView />
        </div>
    );
};

export { PageTasks };
