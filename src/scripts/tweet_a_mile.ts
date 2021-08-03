import fs from 'fs';
import TwitterApi from 'twitter-api-v2';

import { DISTANCE_MILES } from '../constants';
import { getFilePath, metersToFeet } from './utils';

const client = new TwitterApi({
  appKey: 'U6fkvXwsiznoaFXTXZlwCHCHv',
  appSecret: 'JK4WB2oWB7EI5652Ifi6zxC6EncQILVJ6ZXq7VsUmvDuZKtzJ5',
  accessToken: '1418647231897509888-8rzIS3f1M0yCIYgtx2t2H9uNXqhq7i',
  accessSecret: 'vGBjSPye2L5ZNmTgwXCuMAWCyWTCHLnIrnRps3vL48NlO'
});

async function go() {
  for (let mile = 1; mile <= DISTANCE_MILES; mile++) {
    console.log(`Processing mile ${mile}`);

    const geojsonFilePath = getFilePath(mile, 'geojson');
    const file = fs.readFileSync(geojsonFilePath);
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
      } else {
        statusParts.push(`Mile ${mile}`);
      }

      const elevGainFeetDisplay = parseInt(metersToFeet(elevation_difference).toFixed(), 10).toLocaleString();
      const elevGainMetersDisplay = parseInt(elevation_difference.toFixed()).toLocaleString();
      statusParts.push(`Elevation gain: ${elevGainFeetDisplay} ft (${elevGainMetersDisplay} m)`);

      const maxElevFeetDisplay = parseInt(metersToFeet(max_elevation).toFixed(0)).toLocaleString();
      const maxElevMetersDisplay = parseInt(max_elevation.toFixed(0)).toLocaleString();
      statusParts.push(`Max elevation: ${maxElevFeetDisplay} ft (${maxElevMetersDisplay} m)`);

      const status = statusParts.join('\n');

      const photoFilePath = getFilePath(mile, 'png');
      const photo = fs.readFileSync(photoFilePath);

      try {
        const mediaId = await client.v1.uploadMedia(photo, { type: 'png'});
        const statusResponse = await client.v1.tweet(status, { media_ids: [mediaId] });
        console.log(statusResponse);
        section.properties.has_tweeted = true;
        fs.writeFileSync(geojsonFilePath, JSON.stringify(section));
      } catch (error) {
        console.log('Error posting status');
        console.error(error);
      }

      break;
    }
  }
}

go();

