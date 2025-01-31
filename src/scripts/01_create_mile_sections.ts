import fs from "fs";
import along from "@turf/along";
import split from "@turf/line-split";

import { getFilePath, getTrailArg, getDistance } from "./utils";

const go = () => {
  const trailArg = getTrailArg();

  if (!trailArg) {
    console.error("No trail argument provided");
    return;
  }

  const DISTANCE = getDistance(trailArg);

  const fileBuffer = fs.readFileSync(getFilePath(trailArg, "all", "geojson"));
  const all = JSON.parse(fileBuffer.toString());

  let mile = 1;
  let nextSection = all;
  let currentSection = null;

  while (mile <= DISTANCE) {
    console.log(`Processing mile ${mile}`);

    try {
      const splitPoint = along(all, mile, { units: "miles" });
      const splitResult = split(nextSection, splitPoint);

      if (
        !splitResult ||
        !splitResult.features ||
        splitResult.features.length !== 2
      ) {
        console.error(
          `Failed to split at mile ${mile}. Split result:`,
          splitResult
        );
        break;
      }

      [currentSection, nextSection] = splitResult.features;

      fs.writeFileSync(
        getFilePath(trailArg, mile, "geojson"),
        JSON.stringify(currentSection)
      );

      currentSection = nextSection;
      mile++;
    } catch (error) {
      console.error(`Error processing mile ${mile}:`, error);
      break;
    }
  }
};

go();
