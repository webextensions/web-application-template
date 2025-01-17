import {
    ROOT,
    ROOT_ACCOUNT,
    ROOT_SIGN_IN,
    ROOT_TASKS,
    ROOT_UNDER_CONSTRUCTION
} from './pageUrls.js';

const publicPagesConfig = [
    /* eslint-disable @stylistic/no-multi-spaces */
    { excludeFromSitemap: false, location: ROOT                    },
    { excludeFromSitemap: true,  location: ROOT_ACCOUNT            },
    { excludeFromSitemap: false, location: ROOT_SIGN_IN            },
    { excludeFromSitemap: true,  location: ROOT_TASKS              },
    { excludeFromSitemap: true,  location: ROOT_UNDER_CONSTRUCTION }
    /* eslint-enable @stylistic/no-multi-spaces */
].map((item) => {
    if (typeof item === 'string') {
        return {
            location: item
        };
    } else {
        return item;
    }
});

const publicPagesInSitemap = publicPagesConfig.filter((item) => {
    if (item.excludeFromSitemap) {
        return false;
    } else {
        return true;
    }
}).map((item) => {
    return item.location;
});

const publicPages = publicPagesConfig.map((item) => {
    return item.location;
});

export {
    publicPages,
    publicPagesInSitemap
};
