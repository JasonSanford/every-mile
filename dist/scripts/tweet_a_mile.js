"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const twitter_api_v2_1 = __importDefault(require("twitter-api-v2"));
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const client = new twitter_api_v2_1.default({
    appKey: 'U6fkvXwsiznoaFXTXZlwCHCHv',
    appSecret: 'JK4WB2oWB7EI5652Ifi6zxC6EncQILVJ6ZXq7VsUmvDuZKtzJ5',
    accessToken: '1418647231897509888-8rzIS3f1M0yCIYgtx2t2H9uNXqhq7i',
    accessSecret: 'vGBjSPye2L5ZNmTgwXCuMAWCyWTCHLnIrnRps3vL48NlO'
});
async function go() {
    for (let mile = 1; mile <= constants_1.DISTANCE_MILES; mile++) {
        console.log(`Processing mile ${mile}`);
        const geojsonFilePath = utils_1.getFilePath(mile, 'geojson');
        const file = fs_1.default.readFileSync(geojsonFilePath);
        const section = JSON.parse(file.toString());
        const { geocode, has_tweeted, elevation_difference, max_elevation } = section.properties;
        if (!has_tweeted) {
            console.log(`Tweet mile ${mile}`);
            const statusParts = [];
            const placeParts = [];
            for (let i = 0; i < geocode.length; i++) {
                const geocodeItem = geocode[i];
                if (geocodeItem.id.includes('place') || geocodeItem.id.includes('region')) {
                    placeParts.push(geocodeItem.text);
                }
            }
            if (placeParts.length > 0) {
                statusParts.push(`Mile ${mile}, ${placeParts.join(', ')}`);
            }
            else {
                statusParts.push(`Mile ${mile}`);
            }
            const elevGainFeetDisplay = parseInt(utils_1.metersToFeet(elevation_difference).toFixed(), 10).toLocaleString();
            const elevGainMetersDisplay = parseInt(elevation_difference.toFixed()).toLocaleString();
            statusParts.push(`Elevation gain: ${elevGainFeetDisplay} ft (${elevGainMetersDisplay} m)`);
            const maxElevFeetDisplay = parseInt(utils_1.metersToFeet(max_elevation).toFixed(0)).toLocaleString();
            const maxElevMetersDisplay = parseInt(max_elevation.toFixed(0)).toLocaleString();
            statusParts.push(`Max elevation: ${maxElevFeetDisplay} ft (${maxElevMetersDisplay} m)`);
            const status = statusParts.join('\n');
            const photoFilePath = utils_1.getFilePath(mile, 'png');
            const photo = fs_1.default.readFileSync(photoFilePath);
            try {
                const mediaId = await client.v1.uploadMedia(photo, { type: 'png' });
                const statusResponse = await client.v1.tweet(status, { media_ids: [mediaId] });
                console.log(statusResponse);
                section.properties.has_tweeted = true;
                fs_1.default.writeFileSync(geojsonFilePath, JSON.stringify(section));
            }
            catch (error) {
                console.log('Error posting status');
                console.error(error);
            }
            break;
        }
    }
}
go();
