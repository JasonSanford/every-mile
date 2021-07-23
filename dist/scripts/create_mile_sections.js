"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const along_1 = __importDefault(require("@turf/along"));
const line_split_1 = __importDefault(require("@turf/line-split"));
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const fileBuffer = fs_1.default.readFileSync(__dirname + '/../../geom/parkway.geojson');
const parkway = JSON.parse(fileBuffer.toString());
let mile = 1;
let nextSection = parkway;
let currentSection = null;
while (mile <= constants_1.DISTANCE_MILES) {
    console.log(mile);
    const splitPoint = along_1.default(parkway, mile, { units: 'miles' });
    [currentSection, nextSection] = line_split_1.default(nextSection, splitPoint).features;
    fs_1.default.writeFileSync(utils_1.getFilePath(mile), JSON.stringify(currentSection));
    currentSection = nextSection;
    mile++;
}
