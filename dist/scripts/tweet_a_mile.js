"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const twitter_lite_1 = __importDefault(require("twitter-lite"));
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const client = new twitter_lite_1.default({
    // subdomain: "api", // "api" is the default (change for other subdomains)
    // version: "1.1", // version "1.1" is the default (change for other subdomains)
    consumer_key: 'U6fkvXwsiznoaFXTXZlwCHCHv',
    consumer_secret: 'JK4WB2oWB7EI5652Ifi6zxC6EncQILVJ6ZXq7VsUmvDuZKtzJ5',
    access_token_key: '1418647231897509888-8rzIS3f1M0yCIYgtx2t2H9uNXqhq7i',
    access_token_secret: 'vGBjSPye2L5ZNmTgwXCuMAWCyWTCHLnIrnRps3vL48NlO' // from your User (oauth_token_secret)
});
for (let mile = 1; mile <= constants_1.DISTANCE_MILES; mile++) {
    console.log(`Processing mile ${mile}`);
    const filePath = utils_1.getFilePath(mile, 'geojson');
    const file = fs_1.default.readFileSync(filePath);
    const section = JSON.parse(file.toString());
    if (!section.properties.has_tweeted) {
        console.log(`Tweet mile ${mile}`);
        section.properties.has_tweeted = true;
        // fs.writeFileSync(filePath, JSON.stringify(section));
        //   client.post("statuses/update", {
        //     status: `Hello world ${mile}`
        //   })
        //   .then(resp => console.log(resp))
        //   .catch(err => console.log(err));
        break;
    }
}
