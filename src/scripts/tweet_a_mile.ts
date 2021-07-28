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
      const statusParts = [`Mile ${mile}`];

      for (let i = 0; i < geocode.length; i++) {
        const geocodeItem = geocode[i];

        if (geocodeItem.id.includes('place')) {
          statusParts[0] = (`Mile ${mile} - ${geocodeItem.text}`);
          break;
        }
      }

      statusParts.push(`Elevation gain: ${metersToFeet(elevation_difference).toFixed()} ft.`);
      statusParts.push(`Max elevation: ${metersToFeet(max_elevation).toFixed(0)} ft.`);
      statusParts.push('#blueridgeparkway #virginia #northcarolina #blueridge');
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

