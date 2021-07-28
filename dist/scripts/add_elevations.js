"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const async_1 = require("async");
const elevation_1 = require("../elevation");
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const tasks = [];
for (let mile = 401; mile <= constants_1.DISTANCE_MILES; mile++) {
    tasks.push((cb) => {
        setTimeout(() => {
            console.log(`Processing mile ${mile}`);
            const filePath = utils_1.getFilePath(mile, 'geojson');
            const file = fs_1.default.readFileSync(filePath);
            const section = JSON.parse(file.toString());
            const elevationTasks = section.geometry.coordinates.map((coordinate) => {
                return (cb) => {
                    setTimeout(async () => {
                        const [longitude, latitude] = coordinate;
                        try {
                            let elevation = await elevation_1.getElevation(latitude, longitude);
                            elevation = parseFloat(elevation.toFixed(1));
                            cb(null, elevation);
                        }
                        catch (error) {
                            console.log('Error getting elevation', error);
                            // Some elevation errors are ok, just add a null entry.
                            cb(null, null);
                        }
                    }, 20);
                };
            });
            async_1.series(elevationTasks, (error, elevationResults) => {
                if (error) {
                    console.log('error', error);
                    return;
                }
                section.properties.elevations = elevationResults;
                fs_1.default.writeFileSync(filePath, JSON.stringify(section));
                cb(null, elevationResults);
            });
        }, 4000);
    });
}
async_1.series(tasks, (error, results) => {
    if (error) {
        console.log('error', error);
        return;
    }
    console.log(results.length);
});
