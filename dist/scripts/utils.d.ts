declare const trails: readonly ["brp", "at"];
export declare type TrailString = (typeof trails)[number];
declare type Extension = 'geojson' | 'png' | 'gif';
declare const getFilePath: (trailString: TrailString, mile: number | 'all', extension: Extension) => string;
declare const metersToFeet: (meters: number) => number;
declare const getTrailArg: () => TrailString | null;
declare const getDistance: (trailString: TrailString) => number;
export { getFilePath, metersToFeet, getTrailArg, getDistance };
