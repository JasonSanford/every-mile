import fs from "fs";

import { series } from "async";
import { getElevation } from "../elevation";

import { getDistance, getFilePath, getTrailArg } from "./utils";

type NumOrNull = number | null;

type CB = (error: Error | null, results: NumOrNull) => void;

const go = () => {
  const trailArg = getTrailArg();

  if (!trailArg) {
    return;
  }

  const DISTANCE = getDistance(trailArg);
  const tasks = [];

  for (let mile = 2001; mile <= DISTANCE; mile++) {
    tasks.push((cb: CB) => {
      setTimeout(() => {
        console.log(`Processing mile ${mile}`);

        const filePath = getFilePath(trailArg, mile, "geojson");
        const file = fs.readFileSync(filePath);
        const section = JSON.parse(file.toString());

        const elevationTasks = section.geometry.coordinates.map(
          (coordinate: number[]) => {
            return (cbElevation: CB) => {
              setTimeout(async () => {
                const [longitude, latitude] = coordinate;
                try {
                  let elevation = await getElevation(latitude, longitude);
                  elevation = parseFloat(elevation.toFixed(1));
                  cbElevation(null, elevation);
                } catch (error) {
                  console.log("Error getting elevation", error);
                  // Some elevation errors are ok, just add a null entry.
                  cbElevation(null, null);
                }
              }, 20);
            };
          }
        );

        series(elevationTasks, (error, elevationResults) => {
          if (error) {
            console.log("error", error);
            return;
          }

          section.properties.elevations = elevationResults;
          fs.writeFileSync(filePath, JSON.stringify(section));
          cb(
            null,
            Array.isArray(elevationResults) ? elevationResults.length : 0
          );
        });
      }, 100);
    });
  }

  series(tasks, (error, results) => {
    if (error) {
      console.log("error", error);
      return;
    }

    console.log(results?.length);
  });
};

go();
