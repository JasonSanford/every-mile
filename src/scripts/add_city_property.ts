import fs from 'fs';

import { series } from 'async';
import Geocoder from '@mapbox/mapbox-sdk/services/geocoding';

import { DISTANCE_MILES, MAPBOX_TOKEN } from '../constants';
import { getFilePath } from './utils';

const geocoder = Geocoder({ accessToken: MAPBOX_TOKEN });

type CB = (error: Error | null, results: any) => void;

const tasks = [];

for (let mile = 1; mile <= DISTANCE_MILES; mile++) {
  tasks.push((cb: CB) => {
    setTimeout(async () => {
      console.log(`Processing mile ${mile}`);
      const filePath = getFilePath('brp', mile, 'geojson');
      const file = fs.readFileSync(filePath);
      const section = JSON.parse(file.toString());
      const response = await geocoder.reverseGeocode({query: section.geometry.coordinates[0]}).send();
      section.properties.geocode = response.body.features;
      fs.writeFileSync(filePath, JSON.stringify(section));
      cb(null, mile);
    }, 4000);
  });
}

series(tasks, (error, results) => {
  if (error) {
    console.log('errror', error);
    return;
  }

  console.log(results);
});
