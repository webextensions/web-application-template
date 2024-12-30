import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import extend from 'extend';

import { safeArrayPromiseToErrorPromise } from '../../../App/utils/safeArrayPromiseToErrorPromise.js';

import { getProfileForLoggedInUserByUserUuid } from '../../../App/dal.js';

import { useUserUuid } from '../useUserUuid/useUserUuid.js';

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_debounce
function debounce(func, wait = 0, immediate = null) {
    let timeout;
    return function () {
        const
            context = this,
            args = arguments;
        clearTimeout(timeout);
        if (immediate && !timeout) func.apply(context, args);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
    };
}

export const useAuth = function () {
    const {
        userUuid,
        forgetUserUuid
    } = useUserUuid();

    const {
        isPending,
        isFetching,
        isSuccess,
        isError,
        data,
        error
    } = useQuery({
        queryKey: ['profileForLoggedInUser'],
        staleTime: Infinity,
        enabled: !!userUuid,
        queryFn: () => {
            const p = getProfileForLoggedInUserByUserUuid(userUuid);
            const querifiedP = safeArrayPromiseToErrorPromise(p);
            return querifiedP;
        }
    });

    const queryClient = useQueryClient();

    const _invalidateQueries = function () {
        queryClient.invalidateQueries({
            queryKey: ['profileForLoggedInUser'],
            exact: true
        });
    };

    const invalidateQueries = function () {
        // Without this debouncing logic, multiple calls to invalidateQueries() triggerred via different code paths
        // might trigger multiple calls to the server (as observed when logging out from some specific pages, eg: the
        // /resources/web-development page)
        debounce(_invalidateQueries);
    };

    useEffect(() => {
        if (!userUuid) {
            invalidateQueries();
        }
    }, [userUuid]);

    const forgetUserAuth = function () {
        invalidateQueries();
        forgetUserUuid();
    };

    useEffect(() => {
        if (isError) {
            // Note: err.response may be `undefined` if the network connectivity was down
            if (error.response?.status === 403) {
                forgetUserAuth();
            }
        }
    }, [isError]);

    const flagUserIsRegistered = (() => {
        if (!userUuid) {
            return 'no';          // TODO: Export this string as a constant
        } else {
            if (isSuccess) {
                return 'yes';     // TODO: Export this string as a constant
            } else if (isPending && isFetching) {
                return 'loading'; // TODO: Export this string as a constant
            } else {
                return 'unknown'; // TODO: Export this string as a constant
            }
        }
    })();

    const granularUserIsRegistered = (() => {
        if (!userUuid) {
            return 'granular-no';          // TODO: Export this string as a constant
        } else {
            if (isError) {
                return 'granular-error';
            } else if (isSuccess) {
                return 'granular-yes';     // TODO: Export this string as a constant
            } else if (isPending && isFetching) {
                return 'granular-loading'; // TODO: Export this string as a constant
            } else {
                return 'granular-unknown'; // TODO: Export this string as a constant
            }
        }
    })();

    const authDataPatch = function (dataToPatch) {
        const oldData = structuredClone(data);

        const patchedData = extend(true, {}, oldData, dataToPatch);

        queryClient.setQueryData(['profileForLoggedInUser'], patchedData);
    };

    return {
        userUuid,

        forgetUserAuth,
        flagUserIsRegistered,
        granularUserIsRegistered,
        authData: data,
        authDataPatch
    };
};
