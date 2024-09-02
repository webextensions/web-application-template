import { QueryClient } from '@tanstack/react-query';

const retryFn = function (failureCount, error) {
    const errorResponseStatus = error?.response?.status;

    if (
        failureCount < 3 &&
        (
            [502, 503, 504].includes(errorResponseStatus) ||
            errorResponseStatus === undefined // eg: network error
        )
    ) {
        return true;
    } else {
        return false;
    }
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,

            // eg:
            //     * Go offline and come back online
            //     * Locking and unlocking the mobile phone, while the webpage is open
            refetchOnReconnect: false,

            // https://github.com/TanStack/query/issues/2927#issuecomment-974706069
            // https://github.com/TanStack/query/issues/2179
            networkMode: 'always',

            retry: retryFn
        },
        mutations: {
            // https://github.com/TanStack/query/issues/2927#issuecomment-974706069
            // https://github.com/TanStack/query/issues/2179
            networkMode: 'always',

            retry: retryFn
        }
    }
});

export { queryClient };
