export enum PathSlug {
  AppalachianTrail = "appalachian-trail",
  BlueRidgeParkway = "blue-ridge-parkway",
  ContinentalDivideTrail = "continental-divide-trail",
}

export enum PathIdentifier {
  AppalachianTrail = "at",
  BlueRidgeParkway = "brp",
  ContinentalDivideTrail = "cdt",
}

export type PathIdetifierAndMile = {
  path: PathIdentifier;
  mile: number;
};

export type GeocodePart = {
  id: string;
  text: string;
};
