import { DISTANCES, MAP_BUFFER_DISTANCES, MAP_IDS } from '../constants';
const trails = ['brp', 'at'] as const;
export type TrailString = (typeof trails)[number];
const isTrail = (x: any): x is TrailString => trails.includes(x);

const extensionDirMap = {
  geojson: 'geom',
  png: 'images',
  gif: 'images',
};

type Extension = 'geojson' | 'png' | 'gif';

const getFilePath = (trailString: TrailString, mile: number | 'all', extension: Extension) => {
  const directory = extensionDirMap[extension];
  const padAmount = getDistance(trailString).toString().length;
  let fileName = `mile_${mile.toString().padStart(padAmount, '0')}.${extension}`;

  if (mile === 'all') {
    fileName = 'all.geojson';
  }

  return `./${directory}/${trailString}/${fileName}`;
};

const metersToFeet = (meters: number) => {
  return meters * 3.28084;
}

const getTrailArg = (): TrailString | null => {
  try {
    const arg = process.argv.slice(2)[0];
    if (isTrail(arg)) {
      return arg;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const getDistance = (trailString: TrailString) => DISTANCES[trailString];

const getMapId = (trailString: TrailString) => MAP_IDS[trailString];

const getBufferDistance = (trailString: TrailString) => MAP_BUFFER_DISTANCES[trailString];

const getTwitterClientConfig = (trailString: TrailString) => {
  return {
    appKey: process.env[`TWITTER_APP_KEY_${trailString}`] as string,
    appSecret: process.env[`TWITTER_APP_SECRET_${trailString}`] as string,
    accessToken: process.env[`TWITTER_ACCESS_TOKEN_${trailString}`] as string,
    accessSecret: process.env[`TWITTER_ACCESS_SECRET_${trailString}`] as string
  }
};

export { getFilePath, metersToFeet, getTrailArg, getDistance, getMapId, getBufferDistance, getTwitterClientConfig };
