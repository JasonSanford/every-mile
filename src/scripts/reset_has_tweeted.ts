import fs from 'fs';

import { getFilePath, getDistance, getTrailArg } from './utils';

const go = () => {
  const trailArg = getTrailArg();

  if (!trailArg) {
    return;
  }

  const DISTANCE = getDistance(trailArg);

  for (let mile = 1; mile <= DISTANCE; mile++) {
    console.log(`Processing mile ${mile}`);

    const filePath = getFilePath(trailArg, mile, 'geojson');
    const file = fs.readFileSync(filePath);
    const section = JSON.parse(file.toString());

    section.properties.has_tweeted = false;
    fs.writeFileSync(filePath, JSON.stringify(section));
  }
};

go();
