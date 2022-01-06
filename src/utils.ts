import { ParsedUrlQuery } from 'querystring'

import { PathSlug, PathIdentifier, PathAndMile } from './types';
import { DISTANCES } from './constants';

export const pathSlugToIdentifier = (pathSlug: PathSlug) => {
  return {
    'appalachian-trail': PathIdentifier.AppalachianTrail,
    'blue-ridge-parkway': PathIdentifier.BlueRidgeParkway,
  }[pathSlug];
}

export const serializePathAndMile = (query: ParsedUrlQuery): PathAndMile | null => {
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
