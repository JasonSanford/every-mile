"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tilebelt_1 = __importDefault(require("@mapbox/tilebelt"));
const get_pixels_1 = __importDefault(require("get-pixels"));
// function getElevation(latitude: number, longitude: number, cb) {
//   var tileFraction = tilebelt.pointToTileFraction(longitude, latitude, 15);
//   var tile = tileFraction.map(Math.floor);
//   var domain = 'https://api.mapbox.com/v4/';
//   var source = `mapbox.terrain-rgb/${tile[2]}/${tile[0]}/${tile[1]}.pngraw`;
//   var url = `${domain}${source}?access_token=pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrcmYyejJwMzA1ZW0yb29kcGd2aXYzNm8ifQ.Xb6PPg3uG0WCgVffY1xTlg`;
//   getPixels(url, function(err, pixels) {
//     if (err) return cb(err);
//     var xp = tileFraction[0] - tile[0];
//     var yp = tileFraction[1] - tile[1];
//     var x = Math.floor(xp*pixels.shape[0]);
//     var y = Math.floor(yp*pixels.shape[1]);
//     var R = pixels.get(x, y, 0);
//     var G = pixels.get(x, y, 1);
//     var B = pixels.get(x, y, 2);
//     var height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1);
//     return cb(null, height);
//   });
// }
class ElevationFinder {
    async getElevation(latitude, longitude) {
        return new Promise((resolve, reject) => {
            const tileFraction = tilebelt_1.default.pointToTileFraction(longitude, latitude, 15);
            const tile = tileFraction.map(Math.floor);
            const domain = 'https://api.mapbox.com/v4/';
            const source = `mapbox.terrain-rgb/${tile[2]}/${tile[0]}/${tile[1]}.pngraw`;
            const url = `${domain}${source}?access_token=pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrcmYyejJwMzA1ZW0yb29kcGd2aXYzNm8ifQ.Xb6PPg3uG0WCgVffY1xTlg`;
            get_pixels_1.default(url, function (err, pixels) {
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
}
exports.default = ElevationFinder;
