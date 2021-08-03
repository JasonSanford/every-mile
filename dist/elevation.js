"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElevation = void 0;
const fs_1 = __importDefault(require("fs"));
const tilebelt_1 = __importDefault(require("@mapbox/tilebelt"));
const get_pixels_1 = __importDefault(require("get-pixels"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const constants_1 = require("./constants");
const Z = 15;
const getImageFilePath = (x, y) => {
    const fileName = `${x}_${y}.pngraw`;
    return `tmp/elevation_images/${fileName}`;
};
const getImageTile = async (x, y) => {
    const filePath = getImageFilePath(x, y);
    if (fs_1.default.existsSync(filePath)) {
        // console.log('Cache hit');
        // fs.readFileSync(filePath);
        return;
    }
    console.log('Cache miss', filePath);
    const urlFileName = `${Z}/${x}/${y}.pngraw`;
    const url = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${urlFileName}?access_token=${constants_1.MAPBOX_TOKEN}`;
    const response = await node_fetch_1.default(url);
    const buffer = await response.buffer();
    fs_1.default.writeFileSync(filePath, buffer);
};
async function getElevation(latitude, longitude) {
    return new Promise(async (resolve, reject) => {
        const tileFraction = tilebelt_1.default.pointToTileFraction(longitude, latitude, Z);
        const tile = tileFraction.map(Math.floor);
        const [x, y] = tile;
        await getImageTile(x, y);
        // Stolen from https://www.npmjs.com/package/mapbox-elevation
        get_pixels_1.default(getImageFilePath(x, y), 'image/png', (err, pixels) => {
            if (err) {
                reject(err);
            }
            const xp = tileFraction[0] - tile[0];
            const yp = tileFraction[1] - tile[1];
            const x = Math.floor(xp * pixels.shape[0]);
            const y = Math.floor(yp * pixels.shape[1]);
            const red = pixels.get(x, y, 0);
            const green = pixels.get(x, y, 1);
            const blue = pixels.get(x, y, 2);
            const height = -10000 + ((red * 256 * 256 + green * 256 + blue) * 0.1);
            resolve(height);
        });
    });
}
exports.getElevation = getElevation;
