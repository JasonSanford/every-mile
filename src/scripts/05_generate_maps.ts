import fs from "fs";
import { series } from "async";
import fetch from "node-fetch";
import turfBuffer from "@turf/buffer";
import { polygonToLine } from "@turf/polygon-to-line";
import polyline from "@mapbox/polyline";

import {
  getFilePath,
  getDistance,
  getMapId,
  getTrailArg,
  getBufferDistance,
} from "./utils";
import { MAPBOX_TOKEN as access_token } from "../constants";

type CB = (error: Error | null, results: number) => void;

const before_layer = "contour-line";
const padding = "100";
const dimensions = "700x450";
const params = { padding, before_layer, access_token };

const go = () => {
  const trailArg = getTrailArg();

  if (!trailArg) {
    return;
  }

  const DISTANCE = getDistance(trailArg);
  const mapId = getMapId(trailArg);

  const tasks = [];

  for (let mile = 1691; mile <= 1691; mile++) {
    tasks.push((cb: CB) => {
      setTimeout(async () => {
        console.log(`Processing mile ${mile}`);
        const filePath = getFilePath(trailArg, mile, "geojson");
        const file = fs.readFileSync(filePath);
        const section = JSON.parse(file.toString());
        const bufferedLineAsPolygon = turfBuffer(
          section.geometry,
          getBufferDistance(trailArg)
        );
        // Some trails that snake back onto themselves and form a complex polygon
        // break here, so make the buffer smaller until it works. 0.045 generally does
        // const bufferedLineAsPolygon = turfBuffer(section.geometry, 0.045);
        const bufferedLineAsLine = polygonToLine(bufferedLineAsPolygon);
        const corrected = bufferedLineAsLine.geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
        // eslint-disable-next-line
        // @ts-ignore
        const encodedLine = polyline.encode(corrected, 5);
        const path = `path-2+999999-1+999999-0.4(${encodeURIComponent(
          encodedLine
        )})`;
        const url = `https://api.mapbox.com/styles/v1/${mapId}/static/${path}/auto/${dimensions}@2x?${new URLSearchParams(
          params
        )}`;
        const response = await fetch(url);
        const buffer = await response.buffer();
        fs.writeFileSync(getFilePath(trailArg, mile, "png"), buffer);
        cb(null, mile);
      }, 4000);
    });
  }

  series(tasks, (error, results) => {
    if (error) {
      console.log("errror", error);
      return;
    }

    console.log(results);
  });
};

go();
