export enum PathSlug {
  AppalachianTrail = 'appalachian-trail',
  BlueRidgeParkway = 'blue-ridge-parkway',
};

export enum PathIdentifier {
  AppalachianTrail = 'at',
  BlueRidgeParkway = 'brp',
};

export type PathAndMile = {
  path: PathIdentifier,
  mile: number
}
