import fs from 'fs';

import { DISTANCE_MILES } from '../constants';
import { getFilePath } from './utils';

for (let mile = 1; mile <= DISTANCE_MILES; mile++) {
  console.log(`Processing mile ${mile}`);

  const filePath = getFilePath(mile);
  const file = fs.readFileSync(filePath);
  const section = JSON.parse(file.toString());
  
  if (!section.properties.has_tweeted) {
    console.log(`Tweet mile ${mile}`);
    section.properties.has_tweeted = true;
    fs.writeFileSync(filePath, JSON.stringify(section));
    break;
  }
}
