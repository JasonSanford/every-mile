"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metersToFeet = exports.getFilePath = void 0;
const getFilePath = (mile, extension) => {
    const directory = extension === 'geojson' ? 'geom' : 'images';
    const fileName = `mile_${mile.toString().padStart(3, '0')}.${extension}`;
    return `${__dirname}/../../${directory}/${fileName}`;
};
exports.getFilePath = getFilePath;
const metersToFeet = (meters) => {
    return meters * 3.28084;
};
exports.metersToFeet = metersToFeet;
