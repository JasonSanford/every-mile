"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("../constants");
const utils_1 = require("./utils");
for (let mile = 1; mile <= constants_1.DISTANCE_MILES; mile++) {
    console.log(`Processing mile ${mile}`);
    const filePath = utils_1.getFilePath(mile);
    const file = fs_1.default.readFileSync(filePath);
    const section = JSON.parse(file.toString());
    if (!section.properties.has_tweeted) {
        console.log(`Tweet mile ${mile}`);
        section.properties.has_tweeted = true;
        fs_1.default.writeFileSync(filePath, JSON.stringify(section));
        break;
    }
}
