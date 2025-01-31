import fs from "fs";

import { getFilePath, getDistance, getTrailArg } from "./utils";

let mostGain = 0;
let mostGainMile = 1;
let leastGain = 999;
let leastGainMile = 1;
let highestElevation = 0;
let highestElevationMile = 1;
let lowestElevation = 999;
let lowestElevationMile = 1;

const go = () => {
  const trailArg = getTrailArg();

  if (!trailArg) {
    return;
  }

  const DISTANCE = getDistance(trailArg);

  for (let mile = 1001; mile <= DISTANCE; mile++) {
    console.log(`Processing mile ${mile}`);

    const filePath = getFilePath(trailArg, mile, "geojson");
    const file = fs.readFileSync(filePath);
    const section = JSON.parse(file.toString());
    const { elevations } = section.properties;

    const firstElevation = elevations[0];
    const lastElevation = elevations[elevations.length - 1];
    const elevationDifference = lastElevation - firstElevation;
    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);

    console.log(
      `${minElevation} -> ${maxElevation} [${firstElevation} : ${lastElevation}] ${elevationDifference}`
    );
    section.properties.min_elevation = minElevation;
    section.properties.max_elevation = maxElevation;
    section.properties.elevation_difference = elevationDifference;

    if (elevationDifference > mostGain) {
      mostGain = elevationDifference;
      mostGainMile = mile;
    }

    if (elevationDifference < leastGain) {
      leastGain = elevationDifference;
      leastGainMile = mile;
    }

    if (minElevation < lowestElevation) {
      lowestElevation = minElevation;
      lowestElevationMile = mile;
    }

    if (maxElevation > highestElevation) {
      highestElevation = maxElevation;
      highestElevationMile = mile;
    }

    fs.writeFileSync(filePath, JSON.stringify(section));
  }

  console.log(`Most gain mile: ${mostGainMile} (${mostGain})`);
  console.log(`Least gain mile: ${leastGainMile} (${leastGain})`);
  console.log(
    `Lowest elevation mile: ${lowestElevationMile} (${lowestElevation})`
  );
  console.log(
    `Highest elevation mile: ${highestElevationMile} (${highestElevation})`
  );
};

go();
