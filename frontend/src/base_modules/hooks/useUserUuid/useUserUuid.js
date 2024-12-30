import { atom, useAtom } from 'jotai';

import { cookiesParser } from '../../../utils/cookiesParser/cookiesParser.js';

import { removeAuthCookies } from '../../../appUtils/removeAuthCookies.js';

import { USER_UUID_COOKIE_NAME } from '../../../../../backend/shared/appConstants.js';

const getUserUuidFromCookie = function () {
    const userBasicInfoFromCookie = cookiesParser.get(USER_UUID_COOKIE_NAME);
    const userUuidFromCookie = userBasicInfoFromCookie && userBasicInfoFromCookie.uuid;

    if (userUuidFromCookie) {
        return userUuidFromCookie;
    } else {
        return null;
    }
};

const initialUserUuid = getUserUuidFromCookie();

const userUuidAtom = atom(initialUserUuid);

export const useUserUuid = function () {
    const [userUuid, setUserUuid] = useAtom(userUuidAtom);

    /*
    // DEV-HELPER
    typeof DO_NOT_UNCOMMENT;
    const _overrideUserUuid = function (overrideValue) {
        setUserUuid(overrideValue);
    };
    /* */

    const recomputeUserUuid = function () {
        // debugger;
        const userUuidFromCookie = getUserUuidFromCookie();
        setUserUuid(userUuidFromCookie);
    };

    const forgetUserUuid = function () {
        removeAuthCookies();
        recomputeUserUuid();
    };

    return {
        userUuid,
        // _overrideUserUuid,
        recomputeUserUuid,
        forgetUserUuid
    };
};
