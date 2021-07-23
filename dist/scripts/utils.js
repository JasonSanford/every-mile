"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePath = void 0;
const getFilePath = (mile) => {
    const fileName = `mile_${mile.toString().padStart(3, '0')}.geojson`;
    return `${__dirname}/../../geom/${fileName}`;
};
exports.getFilePath = getFilePath;
