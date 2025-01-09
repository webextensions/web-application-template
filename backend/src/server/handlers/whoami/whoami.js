import { sendErrorResponse } from '../../utils/express/sendResponse.js';

import { getLoggedInUserUuidFromRequest } from '../../appUtils/authUtils/authUtils.js';

const whoami = function () {
    return async function (req, res) {
        const loggedInUserUuid = getLoggedInUserUuidFromRequest(req);
        if (!loggedInUserUuid) {
            return sendErrorResponse(res, 401, 'Unauthorized');
        }

        return res.redirect(307, '/api/v1/users/' + loggedInUserUuid + '/owninfo');
    };
};

export { whoami };
