const { execSync } = require('node:child_process');

const writeWithColor = function (message, color) {
    const colors = {
        red:     '\u001B[31m',
        green:   '\u001B[32m',
        yellow:  '\u001B[33m',
        blue:    '\u001B[34m',
        magenta: '\u001B[35m',
        cyan:    '\u001B[36m',
        white:   '\u001B[37m'
    };
    const resetCode = '\u001B[0m';

    // Only use color codes if stdout is a TTY
    const colorCode = process.stdout.isTTY ? (colors[color] || '') : '';
    const reset = process.stdout.isTTY ? resetCode : '';

    // Output the message with the chosen color without a new line
    // process.stdout.write(colorCode + message + reset);
    process.stderr.write(colorCode + message + reset); // Using stderr to avoid including these messages when the command is executed with the JSON mode
};

const stabilityDurationMs = 7 * 24 * 60 * 60 * 1000; // 7 days

module.exports = {
    /** Filter out updates which were released very recently.
      @param {string} packageName               The name of the dependency.
      @param {SemVer[]} currentVersionSemver    Current version declaration in semantic versioning format (may be a range).
      @param {SemVer} upgradedVersionSemver     Upgraded version in semantic versioning format.
      @returns {boolean}                        Return true if the upgrade should be kept, otherwise it will be ignored.
    */
    // https://github.com/raineorshine/npm-check-updates/issues/833
    // https://github.com/raineorshine/npm-check-updates/blob/main/README.md#filterresults
    filterResults: (packageName, { currentVersionSemver, upgradedVersionSemver }) => {
        if (!upgradedVersionSemver) {
            return false;
        } else {
            let mismatchingCurrentSemver = '';
            const flagMatching = (function () {
                for (const ob of currentVersionSemver) {
                    if (
                        ob.major !== upgradedVersionSemver.major ||
                        ob.minor !== upgradedVersionSemver.minor ||
                        ob.patch !== upgradedVersionSemver.patch ||
                        ob.release !== upgradedVersionSemver.release
                    ) {
                        mismatchingCurrentSemver = ob.semver;
                        return false;
                    }
                }
                return true;
            })();

            if (flagMatching) {
                return false;
            }

            const output = execSync(
                `npm view ${packageName} --json`,
                { encoding: 'utf8' }
            );
            const outputAsJson = JSON.parse(output);

            const timestampOfUpgradedVersion = outputAsJson.time[upgradedVersionSemver.version];
            const timeSinceReleaseMs = Date.now() - new Date(timestampOfUpgradedVersion).getTime();

            const relativeTimeString = (function () {
                const days    = Math.floor(timeSinceReleaseMs / (24 * 60 * 60 * 1000));
                const hours   = Math.floor(timeSinceReleaseMs /      (60 * 60 * 1000)) % 24;
                const minutes = Math.floor(timeSinceReleaseMs /           (60 * 1000)) % 60;
                const seconds = Math.floor(timeSinceReleaseMs /                (1000)) % 60;

                if (days >= 1) {
                    return `${days}d`;
                } else if (hours >= 1) {
                    return `${hours}h`;
                } else if (minutes >= 1) {
                    return `${minutes}m`;
                } else {
                    return `${seconds}s`;
                }
            })().padStart(5);
            if (timeSinceReleaseMs < stabilityDurationMs) {
                writeWithColor(` 🕛 Released: ${relativeTimeString} ago; Ignoring:   ${packageName} ${mismatchingCurrentSemver} → ${upgradedVersionSemver.semver}\n`, 'yellow');
                return false;
            } else {
                writeWithColor(` ✅ Released: ${relativeTimeString} ago; Suggesting: ${packageName} ${mismatchingCurrentSemver} → ${upgradedVersionSemver.semver}\n`, 'green');
                return true;
            }
        }
    }
};
