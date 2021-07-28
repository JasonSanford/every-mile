import fs from 'fs';
import along from '@turf/along';
import split from '@turf/line-split';

import { DISTANCE_MILES } from '../constants';
import { getFilePath } from './utils';

const fileBuffer = fs.readFileSync(__dirname + '/../../geom/parkway.geojson');
const parkway = JSON.parse(fileBuffer.toString());

let mile = 1;
let nextSection = parkway;
let currentSection = null;

while (mile <= DISTANCE_MILES) {
  console.log(mile);

  const splitPoint = along(parkway, mile, { units: 'miles' });
  [currentSection, nextSection] = split(nextSection, splitPoint).features;

  fs.writeFileSync(getFilePath(mile, 'geojson'), JSON.stringify(currentSection));

  currentSection = nextSection;
  mile++;
}
