export enum PathSlug {
  AppalachianTrail = 'appalachian-trail',
  BlueRidgeParkway = 'blue-ridge-parkway',
};

export enum PathIdentifier {
  AppalachianTrail = 'at',
  BlueRidgeParkway = 'brp',
};

export type PathIdetifierAndMile = {
  path: PathIdentifier,
  mile: number
};

export type GeocodePart = {
  id: string;
  text: string;
};
