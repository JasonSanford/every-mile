import fs from 'fs';

import tilebelt from '@mapbox/tilebelt';
import getPixels from 'get-pixels';
import fetch from 'node-fetch';

const getImageFilePath = (z: number, x: number, y: number) => {
  const fileName = `${z}_${x}_${y}.pngraw`;
  // `${__dirname}/../../geom/${fileName}`;
  return `tmp/elevation_images/${fileName}`;
};

const getImageTile = async (z: number, x: number, y: number) => {
  const urlFileName = `${z}/${x}/${y}.pngraw`;
  // const fileName = `${z}_${x}_${y}.pngraw`;
  // const filePath = `tmp/elevation_images/${fileName}`;
  const filePath = getImageFilePath(z, x, y);
  if (fs.existsSync(filePath)) {
    console.log('Cache hit');
    const file = fs.readFileSync(filePath);
    return;
  }
  console.log('Cache miss');
  const url = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${urlFileName}?access_token=pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrcmYyejJwMzA1ZW0yb29kcGd2aXYzNm8ifQ.Xb6PPg3uG0WCgVffY1xTlg`;
  // console.log(url);
  const response = await fetch(url);
  const buffer = await response.buffer();
  console.log(filePath);
  fs.writeFileSync(filePath, buffer);
  // return new Uint8Array(buffer);
  // return new Uint8Array(response.buffer)
};

class ElevationFinder {
  async getElevation(latitude: number, longitude: number) {
    return new Promise(async (resolve, reject) => {
      const tileFraction = tilebelt.pointToTileFraction(longitude, latitude, 15);
      const tile = tileFraction.map(Math.floor);
      const [x, y, z] = tile;
      // const fileName = `${tile[2]}/${tile[0]}/${tile[1]}.pngraw`;
      await getImageTile(z, x, y);
      getPixels(getImageFilePath(z, x, y), 'image/png', function(err, pixels) {
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
}

export default ElevationFinder;
