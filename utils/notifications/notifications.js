import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

let notifier;
try {
    notifier = (await import('node-notifier')).default;
} catch (e) {
    console.log(
        'Could not load module "node-notifier".' +
        '\nYou need to run "$ npm install node-notifier" to be able to see desktop notifications.' +
        '\n'
    );
}

const __dirname = dirname(fileURLToPath(import.meta.url));

let muteNotifications = false;

const notify = function (options) {
    if (!muteNotifications) {
        if (notifier) {
            notifier.notify(options);
        }
    }
};

const notifications = {
    info: function (title, message) {
        title +=
        notify({
            title,
            message,
            icon: path.join(__dirname, 'icons', 'info.png')
        });
    },
    warn: function (title, message) {
        notify({
            title,
            message,
            icon: path.join(__dirname, 'icons', 'warn.png')
        });
    },
    error: function (title, message) {
        notify({
            title,
            message,
            icon: path.join(__dirname, 'icons', 'error.png')
        });
    },
    mute: function (flag) {
        muteNotifications = flag;
    }
};

// eslint-disable-next-line import/no-default-export
export default notifications;
