"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const along_1 = __importDefault(require("@turf/along"));
const line_split_1 = __importDefault(require("@turf/line-split"));
const utils_1 = require("./utils");
const go = () => {
    const trailArg = utils_1.getTrailArg();
    if (!trailArg) {
        return;
    }
    const DISTANCE = utils_1.getDistance(trailArg);
    // const fileBuffer = fs.readFileSync(__dirname + `/../../geom/${trailArg}/all.geojson`);
    const fileBuffer = fs_1.default.readFileSync(utils_1.getFilePath(trailArg, 'all', 'geojson'));
    const all = JSON.parse(fileBuffer.toString());
    let mile = 1;
    let nextSection = all;
    let currentSection = null;
    while (mile <= DISTANCE) {
        console.log(mile);
        const splitPoint = along_1.default(all, mile, { units: 'miles' });
        [currentSection, nextSection] = line_split_1.default(nextSection, splitPoint).features;
        fs_1.default.writeFileSync(utils_1.getFilePath(trailArg, mile, 'geojson'), JSON.stringify(currentSection));
        currentSection = nextSection;
        mile++;
    }
};
go();
