import fs from 'fs';

import tilebelt from '@mapbox/tilebelt';
import getPixels from 'get-pixels';
import fetch from 'node-fetch';

import { MAPBOX_TOKEN } from './constants';

const Z = 15;

const getImageFilePath = (x: number, y: number) => {
  const fileName = `${x}_${y}.pngraw`;
  return `tmp/elevation_images/${fileName}`;
};

const getImageTile = async (x: number, y: number) => {
  const filePath = getImageFilePath(x, y);

  if (fs.existsSync(filePath)) {
    // console.log('Cache hit');
    // fs.readFileSync(filePath);
    return;
  }

  console.log('Cache miss', filePath);
  const urlFileName = `${Z}/${x}/${y}.pngraw`;
  const url = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${urlFileName}?access_token=${MAPBOX_TOKEN}`;
  const response = await fetch(url);
  const buffer = await response.buffer();

  fs.writeFileSync(filePath, buffer);
};

async function getElevation(latitude: number, longitude: number): Promise<number> {
  return new Promise(async (resolve, reject) => {
    const tileFraction = tilebelt.pointToTileFraction(longitude, latitude, Z);
    const tile = tileFraction.map(Math.floor);
    const [x, y] = tile;

    await getImageTile(x, y);

    // Stolen from https://www.npmjs.com/package/mapbox-elevation
    getPixels(getImageFilePath(x, y), 'image/png', (err, pixels) => {
      if (err) {
        reject(err);
      }

      const xp = tileFraction[0] - tile[0];
      const yp = tileFraction[1] - tile[1];
      const x = Math.floor(xp * pixels.shape[0]);
      const y = Math.floor(yp * pixels.shape[1]);

      const red = pixels.get(x, y, 0);
      const green = pixels.get(x, y, 1);
      const blue = pixels.get(x, y, 2);

      const height = -10000 + ((red * 256 * 256 + green * 256 + blue) * 0.1);

      resolve(height);
    });
  });
}

export { getElevation };
