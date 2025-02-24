import fs from "fs";
import TwitterApi from "twitter-api-v2";
import { config } from "dotenv";

import {
  getFilePath,
  metersToFeet,
  getTrailArg,
  getDistance,
  getTwitterClientConfig,
  getNextMileFilePath,
} from "./utils";
import { getMileUrl } from "../utils";
import { DISTANCES } from "../constants";

config();

type MediaType = "png" | "gif";

async function go() {
  const trailArg = getTrailArg();

  if (!trailArg) {
    return;
  }

  const DISTANCE = getDistance(trailArg);

  const twitterClientConfig = getTwitterClientConfig(trailArg);

  Object.entries(twitterClientConfig).forEach(([key, value]) => {
    console.log(`${key}: Length ${value.length}`);
  });

  const client = new TwitterApi(twitterClientConfig);

  const nextMileFilePath = getNextMileFilePath(trailArg);

  const file = fs.readFileSync(nextMileFilePath);
  let mile = JSON.parse(file.toString());

  if (mile > DISTANCES[trailArg]) {
    console.log("We have reached the end");
    mile = 1;
  }

  console.log(`Processing mile ${mile}`);

  const geojsonFilePath = getFilePath(trailArg, mile, "geojson");
  const geojsonFile = fs.readFileSync(geojsonFilePath);
  const section = JSON.parse(geojsonFile.toString());
  const { geocode, elevation_difference, max_elevation } = section.properties;
  const statusParts = [];
  const placeParts = [];
  for (let i = 0; i < geocode.length; i++) {
    const geocodeItem = geocode[i];

    if (geocodeItem.id.includes("place") || geocodeItem.id.includes("region")) {
      placeParts.push(geocodeItem.text);
    }
  }

  const mileageText = `Mile ${mile} of ${DISTANCE.toLocaleString()}`;

  if (placeParts.length > 0) {
    statusParts.push(`${mileageText}: ${placeParts.join(", ")}`);
  } else {
    statusParts.push(mileageText);
  }

  const elevGainFeetDisplay = parseInt(
    metersToFeet(elevation_difference).toFixed(),
    10
  ).toLocaleString();
  const elevGainMetersDisplay = parseInt(
    elevation_difference.toFixed()
  ).toLocaleString();
  statusParts.push(
    `Elevation gain: ${elevGainFeetDisplay} ft (${elevGainMetersDisplay} m)`
  );

  const maxElevFeetDisplay = parseInt(
    metersToFeet(max_elevation).toFixed(0)
  ).toLocaleString();
  const maxElevMetersDisplay = parseInt(
    max_elevation.toFixed(0)
  ).toLocaleString();
  statusParts.push(
    `Max elevation: ${maxElevFeetDisplay} ft (${maxElevMetersDisplay} m)`
  );

  statusParts.push(getMileUrl(trailArg, mile));

  const status = statusParts.join("\n");

  let mediaFilePath = getFilePath(trailArg, mile, "png");
  let media = fs.readFileSync(mediaFilePath);
  let mediaType: MediaType = "png";

  try {
    mediaFilePath = getFilePath(trailArg, mile, "gif");
    media = fs.readFileSync(mediaFilePath);
    mediaType = "gif";
  } catch (error) {
    console.log("No gif found");
  }

  try {
    const mediaId = await client.v1.uploadMedia(media, { type: mediaType });
    const statusResponse = await client.v2.tweet(status, {
      media: { media_ids: [mediaId] },
    });
    console.log(statusResponse);
    fs.writeFileSync(nextMileFilePath, JSON.stringify(mile + 1));
  } catch (error) {
    console.log("Error posting status");
    console.error(error);
  }
}

go();
