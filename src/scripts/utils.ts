import { DISTANCES } from '../constants';
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

export { getFilePath, metersToFeet, getTrailArg, getDistance };
