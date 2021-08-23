import fs from 'fs';

import { DISTANCE_MILES } from '../constants';
import { getFilePath } from './utils';

for (let mile = 1; mile <= DISTANCE_MILES; mile++) {
  console.log(`Processing mile ${mile}`);

  const filePath = getFilePath('brp', mile, 'geojson');
  const file = fs.readFileSync(filePath);
  const section = JSON.parse(file.toString());
  
  section.properties.has_tweeted = false;
  fs.writeFileSync(filePath, JSON.stringify(section));
}
