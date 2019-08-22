/* globals describe, it */

describe('Application', function () {
    const application = require('../server/application.js'); // eslint-disable-line no-unused-vars

    // If there would be an error in "require()", the code would not reach this point
    it('should load /server/application.js fine using require', function (done) {
        done();
    });
});
