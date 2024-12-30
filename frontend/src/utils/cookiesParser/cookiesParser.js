import Cookies from 'js-cookie';

// Example usage:
// const data = cookiesParser.get('cookie-name-goes-here');

const cookiesParser = Cookies.withConverter({
    // Read converter
    read: function (value, name) { // eslint-disable-line no-unused-vars
        let resp;
        try {
            resp = decodeURIComponent(value);
        } catch (e) { // eslint-disable-line no-unused-vars
            resp = unescape(value);
        }
        if (resp.indexOf('j:') === 0) {
            // Strip "j:"
            resp = resp.slice(2);
            try {
                resp = JSON.parse(resp);
            } catch (e) { // eslint-disable-line no-unused-vars
                resp = {};
            }
        }
        return resp;
    }
});

export { cookiesParser };
