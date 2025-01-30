import { ParsedUrlQuery } from "querystring";

import { getDistance } from "./scripts/utils";
import {
  PathSlug,
  PathIdentifier,
  PathIdetifierAndMile,
  GeocodePart,
} from "./types";
import { DISTANCES, APPALACHIAN_TRAIL, BLUE_RIDGE_PARKWAY } from "./constants";

export const pathSlugToIdentifier = (pathSlug: PathSlug) => {
  return {
    "appalachian-trail": PathIdentifier.AppalachianTrail,
    "blue-ridge-parkway": PathIdentifier.BlueRidgeParkway,
  }[pathSlug];
};

export const pathIdentifierToName = (pathIdentifier: PathIdentifier) => {
  return {
    at: APPALACHIAN_TRAIL,
    brp: BLUE_RIDGE_PARKWAY,
  }[pathIdentifier];
};

export const pathIdentifierToSlug = (pathIdentifier: PathIdentifier) => {
  return {
    at: "appalachian-trail",
    brp: "blue-ridge-parkway",
  }[pathIdentifier];
};

export const serializePathIdentifierAndMile = (
  query: ParsedUrlQuery
): PathIdetifierAndMile | null => {
  let { mile: mileString, path_slug: pathSlug } = query;

  if (pathSlug) {
    if (Array.isArray(pathSlug)) {
      pathSlug = pathSlug.join("");
    }
  } else {
    return null;
  }

  if (mileString) {
    if (Array.isArray(mileString)) {
      mileString = mileString.join("");
    }
  } else {
    return null;
  }

  try {
    if (!(<any>Object).values(PathSlug).includes(pathSlug)) {
      return null;
    }
    const path = pathSlugToIdentifier(pathSlug as PathSlug);
    const mile = parseInt(mileString, 10);

    if (mile < 1 || mile > DISTANCES[path]) {
      return null;
    }

    return {
      path,
      mile,
    };
  } catch (e) {
    return null;
  }
};

export const serializePathIdentifier = (
  query: ParsedUrlQuery
): PathIdentifier | null => {
  let { path_slug: pathSlug } = query;

  if (pathSlug) {
    if (Array.isArray(pathSlug)) {
      pathSlug = pathSlug.join("");
    }
  } else {
    return null;
  }
  try {
    if (!(<any>Object).values(PathSlug).includes(pathSlug)) {
      return null;
    }
    const pathIdentifier = pathSlugToIdentifier(pathSlug as PathSlug);

    return pathIdentifier;
  } catch (e) {
    return null;
  }
};

export const getOgImageUrl = (pathIdentifier: PathIdentifier, mile: number) => {
  const rootUrl =
    process.env.NODE_ENV === "production"
      ? "https://every-mile.vercel.app"
      : "http://localhost:3000";
  const padAmount = getDistance(pathIdentifier).toString().length;
  const fileName = `mile_${mile.toString().padStart(padAmount, "0")}.png`;
  return `${rootUrl}/images/${pathIdentifier}/${fileName}`;
};

export const getMilePath = (pathIdentifier: PathIdentifier, mile: number) => {
  const slug = pathIdentifierToSlug(pathIdentifier);
  return `/${slug}/mile/${mile}`;
};

export const getMileUrl = (pathIdentifier: PathIdentifier, mile: number) => {
  const root =
    process.env.GITHUB_ACTIONS === "true"
      ? "https://every-mile.vercel.app"
      : "http://localhost:3000";
  const path = getMilePath(pathIdentifier, mile);
  return `${root}${path}`;
};

export const chunkify = (things: Array<any>, chunkSize: number) => {
  const res = [];

  for (let i = 0; i < things.length; i += chunkSize) {
    const chunk = things.slice(i, i + chunkSize);
    res.push(chunk);
  }

  return res;
};

export const geocodeToLocationString = (
  geocode: GeocodePart[]
): string | null => {
  const locationParts = [];

  for (let i = 0; i < geocode.length; i++) {
    const geocodePart = geocode[i];

    if (geocodePart.id.includes("place") || geocodePart.id.includes("region")) {
      locationParts.push(geocodePart.text);
    }
  }

  if (locationParts.length > 0) {
    return locationParts.join(", ");
  }

  return null;
};
