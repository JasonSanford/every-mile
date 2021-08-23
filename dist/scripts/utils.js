"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwitterClientConfig = exports.getBufferDistance = exports.getMapId = exports.getDistance = exports.getTrailArg = exports.metersToFeet = exports.getFilePath = void 0;
const constants_1 = require("../constants");
const trails = ['brp', 'at'];
const isTrail = (x) => trails.includes(x);
const extensionDirMap = {
    geojson: 'geom',
    png: 'images',
    gif: 'images',
};
const getFilePath = (trailString, mile, extension) => {
    const directory = extensionDirMap[extension];
    const padAmount = getDistance(trailString).toString().length;
    let fileName = `mile_${mile.toString().padStart(padAmount, '0')}.${extension}`;
    if (mile === 'all') {
        fileName = 'all.geojson';
    }
    return `./${directory}/${trailString}/${fileName}`;
};
exports.getFilePath = getFilePath;
const metersToFeet = (meters) => {
    return meters * 3.28084;
};
exports.metersToFeet = metersToFeet;
const getTrailArg = () => {
    try {
        const arg = process.argv.slice(2)[0];
        if (isTrail(arg)) {
            return arg;
        }
        return null;
    }
    catch (error) {
        return null;
    }
};
exports.getTrailArg = getTrailArg;
const getDistance = (trailString) => constants_1.DISTANCES[trailString];
exports.getDistance = getDistance;
const getMapId = (trailString) => constants_1.MAP_IDS[trailString];
exports.getMapId = getMapId;
const getBufferDistance = (trailString) => constants_1.MAP_BUFFER_DISTANCES[trailString];
exports.getBufferDistance = getBufferDistance;
const getTwitterClientConfig = (trailString) => {
    return {
        appKey: process.env[`TWITTER_APP_KEY_${trailString}`],
        appSecret: process.env[`TWITTER_APP_SECRET_${trailString}`],
        accessToken: process.env[`TWITTER_ACCESS_TOKEN_${trailString}`],
        accessSecret: process.env[`TWITTER_ACCESS_SECRET_${trailString}`]
    };
};
exports.getTwitterClientConfig = getTwitterClientConfig;
