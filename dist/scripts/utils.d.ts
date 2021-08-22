declare type Extension = 'geojson' | 'png' | 'gif';
declare const getFilePath: (mile: number, extension: Extension) => string;
declare const metersToFeet: (meters: number) => number;
export { getFilePath, metersToFeet };
