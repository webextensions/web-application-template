import { cookiesParser } from '../utils/cookiesParser/cookiesParser.js';

import {
    USER_UUID_COOKIE_NAME,
    USER_AUTH_COOKIE_NAME
} from '../../../backend/shared/appConstants.js';

const removeAuthCookies = () => {
    // `{ secure: true, SameSite: 'none' }` is required due to cross-frame behavior it seems. Not necessary when the
    // code is executing directly, without any parent window.
    // cookiesParser.remove(USER_UUID_COOKIE_NAME, { secure: true, SameSite: 'none' });
    // cookiesParser.remove(USER_AUTH_COOKIE_NAME, { secure: true, SameSite: 'none' });

    cookiesParser.remove(USER_UUID_COOKIE_NAME);
    cookiesParser.remove(USER_AUTH_COOKIE_NAME);
};

export { removeAuthCookies };
