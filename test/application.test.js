// If there would be an error in "import", the test would not even load/start
import { application } from '../server/application.js'; // eslint-disable-line no-unused-vars

describe('Application', function () {
    it('should load /server/application.js fine using require', function (done) {
        done();
    });
});
