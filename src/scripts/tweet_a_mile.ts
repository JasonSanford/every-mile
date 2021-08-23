import fs from 'fs';
import TwitterApi from 'twitter-api-v2';
import { config } from 'dotenv';

import { getFilePath, metersToFeet, getTrailArg, getDistance, getTwitterClientConfig } from './utils';

config();

type MediaType = 'png' | 'gif';

async function go() {
  const trailArg = getTrailArg();

  if (!trailArg) {
    return;
  }

  const DISTANCE = getDistance(trailArg);

  const twitterClientConfig = getTwitterClientConfig(trailArg);

  const client = new TwitterApi(twitterClientConfig);

  for (let mile = 1; mile <= DISTANCE; mile++) {
    console.log(`Processing mile ${mile}`);

    const geojsonFilePath = getFilePath('brp', mile, 'geojson');
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

      const mileageText = `Mile ${mile} of ${DISTANCE.toLocaleString()}`
      if (placeParts.length > 0) {
        statusParts.push(`${mileageText}: ${placeParts.join(', ')}`);
      } else {
        statusParts.push(mileageText);
      }

      const elevGainFeetDisplay = parseInt(metersToFeet(elevation_difference).toFixed(), 10).toLocaleString();
      const elevGainMetersDisplay = parseInt(elevation_difference.toFixed()).toLocaleString();
      statusParts.push(`Elevation gain: ${elevGainFeetDisplay} ft (${elevGainMetersDisplay} m)`);

      const maxElevFeetDisplay = parseInt(metersToFeet(max_elevation).toFixed(0)).toLocaleString();
      const maxElevMetersDisplay = parseInt(max_elevation.toFixed(0)).toLocaleString();
      statusParts.push(`Max elevation: ${maxElevFeetDisplay} ft (${maxElevMetersDisplay} m)`);

      const status = statusParts.join('\n');

      let mediaFilePath = getFilePath('brp', mile, 'png');
      let media = fs.readFileSync(mediaFilePath);
      let mediaType: MediaType = 'png';

      try {
        mediaFilePath = getFilePath('brp', mile, 'gif');
        media = fs.readFileSync(mediaFilePath);
        mediaType = 'gif';
      } catch (error) {
        console.log('No gif found');
      }

      try {
        const mediaId = await client.v1.uploadMedia(media, { type: mediaType });
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

