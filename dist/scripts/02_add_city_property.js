"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const async_1 = require("async");
const geocoding_1 = __importDefault(require("@mapbox/mapbox-sdk/services/geocoding"));
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const geocoder = geocoding_1.default({ accessToken: constants_1.MAPBOX_TOKEN });
const go = () => {
    const trailArg = utils_1.getTrailArg();
    if (!trailArg) {
        return;
    }
    const DISTANCE = utils_1.getDistance(trailArg);
    const tasks = [];
    for (let mile = 1; mile <= DISTANCE; mile++) {
        tasks.push((cb) => {
            setTimeout(async () => {
                console.log(`Processing mile ${mile}`);
                const filePath = utils_1.getFilePath(trailArg, mile, 'geojson');
                const file = fs_1.default.readFileSync(filePath);
                const section = JSON.parse(file.toString());
                const response = await geocoder.reverseGeocode({ query: section.geometry.coordinates[0] }).send();
                section.properties.geocode = response.body.features;
                fs_1.default.writeFileSync(filePath, JSON.stringify(section));
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
};
go();
