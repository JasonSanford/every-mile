"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metersToFeet = exports.getFilePath = void 0;
const extensionDirMap = {
    geojson: 'geom',
    png: 'images',
    gif: 'images',
};
const getFilePath = (mile, extension) => {
    const directory = extensionDirMap[extension];
    const fileName = `mile_${mile.toString().padStart(4, '0')}.${extension}`;
    return `${__dirname}/../../${directory}/${fileName}`;
};
exports.getFilePath = getFilePath;
const metersToFeet = (meters) => {
    return meters * 3.28084;
};
exports.metersToFeet = metersToFeet;
