/* globals describe, it */

// If there would be an error in "import", the test would not even load/start
import { application } from '../server/application.mjs'; // eslint-disable-line no-unused-vars

describe('Application', function () {
    it('should load /server/application.mjs fine using require', function (done) {
        done();
    });
});
