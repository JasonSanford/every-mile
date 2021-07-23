"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const async_1 = require("async");
const elevation_finder_1 = __importDefault(require("../elevation_finder"));
const utils_1 = require("./utils");
// const geocoder = Geocoder({ accessToken: 'pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrcmYyejJwMzA1ZW0yb29kcGd2aXYzNm8ifQ.Xb6PPg3uG0WCgVffY1xTlg' });
const elevationFinder = new elevation_finder_1.default();
const tasks = [];
for (let mile = 1; mile <= 3; mile++) {
    tasks.push((cb) => {
        setTimeout(async () => {
            console.log(`Processing mile ${mile}`);
            const filePath = utils_1.getFilePath(mile);
            const file = fs_1.default.readFileSync(filePath);
            const section = JSON.parse(file.toString());
            const [longitude, latitude] = section.geometry.coordinates[0];
            const elevation = await elevationFinder.getElevation(latitude, longitude);
            console.log(elevation);
            // const elevations = section.geometry.coordinates.map(coordinate => {
            //   const [longitude, latitude] = coordinate;
            //   elevationFinder.getElevation(latitude, longitude);
            // });
            // const response = await geocoder.reverseGeocode({query: section.geometry.coordinates[0]}).send();
            // section.properties.geocode = response.body.features;
            // fs.writeFileSync(filePath, JSON.stringify(section));
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
