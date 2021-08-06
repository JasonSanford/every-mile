"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const async_1 = require("async");
const node_fetch_1 = __importDefault(require("node-fetch"));
const buffer_1 = __importDefault(require("@turf/buffer"));
const polygon_to_line_1 = require("@turf/polygon-to-line");
const polyline_1 = __importDefault(require("@mapbox/polyline"));
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const access_token = 'pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrZG1kdnU5NzE3bG4yenBkbzU5bDQ2NXMifQ.IMquilPKSANQDaSzf3fjcg';
const before_layer = 'contour-line';
const padding = '100';
const mapId = 'jcsanford/ckrm3rsr78uiq17q31yhwzul2';
const dimensions = '700x450';
const params = { padding, before_layer, access_token };
const tasks = [];
for (let mile = 401; mile <= constants_1.DISTANCE_MILES; mile++) {
    tasks.push((cb) => {
        setTimeout(async () => {
            console.log(`Processing mile ${mile}`);
            const filePath = utils_1.getFilePath(mile, 'geojson');
            const file = fs_1.default.readFileSync(filePath);
            const section = JSON.parse(file.toString());
            const bufferedLineAsPolygon = buffer_1.default(section.geometry, 0.075);
            const bufferedLineAsLine = polygon_to_line_1.polygonToLine(bufferedLineAsPolygon);
            const corrected = bufferedLineAsLine.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            // @ts-ignore
            const encodedLine = polyline_1.default.encode(corrected, 5);
            const path = `path-2+999999-1+999999-0.4(${encodeURIComponent(encodedLine)})`;
            const url = `https://api.mapbox.com/styles/v1/${mapId}/static/${path}/auto/${dimensions}@2x?${(new URLSearchParams(params))}`;
            const response = await node_fetch_1.default(url);
            const buffer = await response.buffer();
            fs_1.default.writeFileSync(utils_1.getFilePath(mile, 'png'), buffer);
            cb(null, mile);
        }, 4000);
    });
}
async_1.series(tasks, (error, results) => {
    if (error) {
        console.log('errror', error);
        return;
    }
    console.log(results);
});
