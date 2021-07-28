import fs from 'fs';
import { series } from 'async';
import fetch from 'node-fetch';
import turfBuffer from '@turf/buffer';
import { polygonToLine } from '@turf/polygon-to-line';
import polyline from '@mapbox/polyline';

import { DISTANCE_MILES } from '../constants';
import { getFilePath } from './utils';

type CB = (error: Error | null, results: any) => void;

const access_token = 'pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrZG1kdnU5NzE3bG4yenBkbzU5bDQ2NXMifQ.IMquilPKSANQDaSzf3fjcg';
const before_layer = 'contour-line';
const padding = '100';
const mapId = 'jcsanford/ckrm3rsr78uiq17q31yhwzul2';
const dimensions = '700x450';
const params = { padding, before_layer, access_token };

const tasks = [];

for (let mile = 400; mile <= DISTANCE_MILES; mile++) {
  tasks.push((cb: CB) => {
    setTimeout(async () => {
      console.log(`Processing mile ${mile}`);
      const filePath = getFilePath(mile, 'geojson');
      const file = fs.readFileSync(filePath);
      const section = JSON.parse(file.toString());
      const bufferedLineAsPolygon = turfBuffer(section.geometry, 0.075);
      const bufferedLineAsLine = polygonToLine(bufferedLineAsPolygon);
      // @ts-ignore
      const corrected = bufferedLineAsLine.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      // @ts-ignore
      const encodedLine = polyline.encode(corrected, 5);
      const path = `path-2+999999-1+999999-0.4(${encodeURIComponent(encodedLine)})`;
      const url = `https://api.mapbox.com/styles/v1/${mapId}/static/${path}/auto/${dimensions}@2x?${(new URLSearchParams(params))}`;
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFileSync(getFilePath(mile, 'png'), buffer);
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
