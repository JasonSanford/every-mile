import { ParsedUrlQuery } from 'querystring';

import { PathSlug, PathIdentifier, PathIdetifierAndMile } from './types';
import { DISTANCES, APPALACHIAN_TRAIL, BLUE_RIDGE_PARKWAY } from './constants';

export const pathSlugToIdentifier = (pathSlug: PathSlug) => {
  return {
    'appalachian-trail': PathIdentifier.AppalachianTrail,
    'blue-ridge-parkway': PathIdentifier.BlueRidgeParkway,
  }[pathSlug];
};

export const pathIdentifierToName = (pathIdentifier: PathIdentifier) => {
  return {
    'at': APPALACHIAN_TRAIL,
    'brp': BLUE_RIDGE_PARKWAY,
  }[pathIdentifier];
};

export const serializePathIdentifierAndMile = (query: ParsedUrlQuery): PathIdetifierAndMile | null => {
  let { mile: mileString, path_slug: pathSlug } = query;

  if (pathSlug) {
    if (Array.isArray(pathSlug)) {
      pathSlug = pathSlug.join('');
    }
  } else {
    return null;
  }

  if (mileString) {
    if (Array.isArray(mileString)) {
      mileString = mileString.join('');
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
      mile
    };
  } catch (e) {
    return null;
  }
}

export const serializePathIdentifier = (query: ParsedUrlQuery): PathIdentifier | null => {
  let { path_slug: pathSlug } = query;

  if (pathSlug) {
    if (Array.isArray(pathSlug)) {
      pathSlug = pathSlug.join('');
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
}
