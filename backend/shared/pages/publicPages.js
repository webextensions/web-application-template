import {
    ROOT,
    ROOT_ACCOUNT,
    ROOT_SIGN_IN,
    ROOT_TASKS,
    ROOT_UNDER_CONSTRUCTION
} from './pageUrls.js';

const publicPagesConfig = [
    ROOT,
    {   location: ROOT_ACCOUNT,            excludeFromSitemap: true },
    ROOT_SIGN_IN,
    {   location: ROOT_TASKS,              excludeFromSitemap: true },

    {   location: ROOT_UNDER_CONSTRUCTION, excludeFromSitemap: true }
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
