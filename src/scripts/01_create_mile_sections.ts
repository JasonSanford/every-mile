import fs from 'fs';
import along from '@turf/along';
import split from '@turf/line-split';

import { getFilePath, getTrailArg, getDistance } from './utils';


const go = () => {
  const trailArg = getTrailArg();

  if (!trailArg) {
    return;
  }

  const DISTANCE = getDistance(trailArg);

  const fileBuffer = fs.readFileSync(getFilePath(trailArg, 'all', 'geojson'));
  const all = JSON.parse(fileBuffer.toString());

  let mile = 1;
  let nextSection = all;
  let currentSection = null;

  while (mile <= DISTANCE) {
    console.log(mile);

    const splitPoint = along(all, mile, { units: 'miles' });
    [currentSection, nextSection] = split(nextSection, splitPoint).features;

    fs.writeFileSync(getFilePath(trailArg, mile, 'geojson'), JSON.stringify(currentSection));

    currentSection = nextSection;
    mile++;
  }
};

go();
