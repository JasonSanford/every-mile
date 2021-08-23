"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const go = () => {
    const trailArg = utils_1.getTrailArg();
    if (!trailArg) {
        return;
    }
    const DISTANCE = utils_1.getDistance(trailArg);
    for (let mile = 1; mile <= DISTANCE; mile++) {
        console.log(`Processing mile ${mile}`);
        const filePath = utils_1.getFilePath(trailArg, mile, 'geojson');
        const file = fs_1.default.readFileSync(filePath);
        const section = JSON.parse(file.toString());
        section.properties.has_tweeted = false;
        fs_1.default.writeFileSync(filePath, JSON.stringify(section));
    }
};
go();
