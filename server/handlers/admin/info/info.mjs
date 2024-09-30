#!/usr/bin/env node --no-warnings=ExperimentalWarning

import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import os from 'node:os';

import { createRequire } from 'module';

import si from 'systeminformation';
import { diskSpaceForFilesystemOwningPath } from '@sindresorhus/df';

import { humanReadableByteSize } from 'helpmate/dist/misc/humanReadableByteSize.cjs';
import { getReadableRelativeTime } from 'helpmate/dist/misc/getReadableRelativeTime.cjs';

import { sendSuccessResponse } from '../../../utils/express-utils/express-utils.mjs';

const packageJson = createRequire(import.meta.url)('../../../../package.json');
// TODO: Refactor to `import packageJson from '../../../../package.json' assert { type: 'json' };` when the "ExperimentalWarning: Importing JSON modules" goes away (https://github.com/nodejs/node/issues/51347)

const beginTimestamp = Date.now();

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..', '..', '..');

// Note: Keep this as the first line of the application code to ensure that this global variable is available throughout the worker
// LAZY: HACK: Generate a 4 character long alphanumeric string ('1234' ensures that there are 4 characters even if the random string is empty)
global.instanceId = global.instanceId || (Math.random().toString(36).slice(2) + '1234').substring(0, 4);

const info = async (req, res) => {
    const infoOb = {};

    infoOb.version = packageJson.version;
    infoOb.nodeJsVersion = process.version;
    infoOb.projectRoot = projectRoot;

    infoOb.instance = {
        instanceId: global.instanceId,
        runningSinceEpoch: beginTimestamp,
        runningSinceTime: new Date(beginTimestamp).toString(),
        runningSinceTimeISO: new Date(beginTimestamp).toISOString(),
        runningSinceRelative: getReadableRelativeTime(beginTimestamp)
    };

    infoOb.os = {
        platform: os.platform(),
        release: os.release(),
        version: os.version()
    };

    try {
        const mem = await si.mem();
        infoOb.memory = {
            total: humanReadableByteSize(mem.total),
            active: humanReadableByteSize(mem.active),
            available: humanReadableByteSize(mem.available),
            swaptotal: humanReadableByteSize(mem.swaptotal),
            swapused: humanReadableByteSize(mem.swapused),
            swapfree: humanReadableByteSize(mem.swapfree)
            // free: humanReadableByteSize(mem.free),
            // used: humanReadableByteSize(mem.used),
            // buffcache: humanReadableByteSize(mem.buffcache)
        };

        const diskDetails = await diskSpaceForFilesystemOwningPath(__dirname);
        infoOb.disk = {
            totalDiskSpace: humanReadableByteSize(diskDetails.size),
            freeDiskSpace: humanReadableByteSize(diskDetails.available)
        };

        const cpu = await si.cpu();
        infoOb.cpu = {
            manufacturer: cpu.manufacturer,
            brand: cpu.brand,
            speed: cpu.speed,
            cores: cpu.cores
        };
        infoOb.cpus = [];
        os.cpus().forEach((cpu) => {
            infoOb.cpus.push({
                model: cpu.model,
                speed: cpu.speed
            });
        });

        infoOb.env = process.env;
    } catch (error) {
        console.error('Error fetching system information:', error);
    }

    return sendSuccessResponse(res, infoOb, { beautify: true });
};

export { info };
