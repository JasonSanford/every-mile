import fs from 'fs';
import { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import mapboxgl, { GeoJSONSource, LngLatLike, MapboxGeoJSONFeature } from 'mapbox-gl';

import { DISTANCES, MAP_IDS } from '../../../constants';
import { serializePathIdentifierAndMile, pathIdentifierToName, getOgImageUrl, getMilePath, geocodeToLocationString } from '../../../utils';
import { ParsedUrlQuery } from 'querystring';
import { getFilePath, metersToFeet } from '../../../scripts/utils';
import Link from 'next/link';
import MapboxMap from '../../../components/MapboxMap';
import { GeocodePart } from '../../../types';

type LineString = {
  type: string;
  coordinates: LngLatLike[];
}

type MileProps = {
  section: MapboxGeoJSONFeature,
  geocode: GeocodePart[];
  minElevation: number;
  maxElevation: number;
  diffElevation: number;
};

const Mile = ({
  section, geocode, maxElevation, diffElevation
}: MileProps) => {
  const geometry = (section.geometry as LineString);
  const router = useRouter();
  const serialized = serializePathIdentifierAndMile(router.query);
  
  if (!serialized) {
    // TODO: 404
    return <p>nope</p>;
  }
  
  const { path, mile } = serialized;
  const name = pathIdentifierToName(path);

  const adjacentMiles = [];

  if (mile > 1) {
    const previousMile = mile - 1;

    adjacentMiles.push(
      <Link href={getMilePath(path, previousMile)}>
        <button className="rounded-full">&larr; Previous Mile ({previousMile})</button>
      </Link>
    )
  }

  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  if (mile !== DISTANCES[path]) {
    const nextMile = mile + 1;

    adjacentMiles.push(
      <Link href={getMilePath(path, nextMile)}>
        <button className="rounded-full">Next Mile ({nextMile}) &rarr;</button>
      </Link>
    )
  }

  if (adjacentMiles.length === 2) {
    adjacentMiles.splice(1, 0, <span>&nbsp;|&nbsp;</span>);
  }

  useEffect(() => {
    if (map) {
      const bounds = new mapboxgl.LngLatBounds(
        geometry.coordinates[0],
        geometry.coordinates[0]
      );

      for (const coord of geometry.coordinates) {
        bounds.extend(coord);
      }

      map.fitBounds(bounds, { padding: 100 });

      const currentSource = map.getSource('mile');
      if (currentSource) {
        (currentSource as GeoJSONSource).setData(section);
      } else {
        map.addSource('mile', {
          type: 'geojson',
          data: section
        });
      }

      const currentLineLayer = map.getLayer('mile-line-layer');
      if (!currentLineLayer) {
        map.addLayer({
          'id': 'mile-line-layer',
          'type': 'line',
          'source': 'mile',
          'layout': {
            'line-cap': 'round',
            'line-join': 'round',
          },
          'paint': {
            'line-opacity': 1,
            'line-color': '#04b262',
            'line-width': 12,
          }
        });
      }

      const currentFillLayer = map.getLayer('mile-fill-layer');
      if (!currentFillLayer) {
        map.addLayer({
          id: 'mile-fill-layer',
          type: 'symbol',
          source: 'mile',
          layout: {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-image': ['image', 'direction-marker'],
            'icon-rotate': 90,
            'symbol-placement': 'line',
            'symbol-spacing': 30,
            'icon-size': 0.8
          },
          paint: {}
        })
      }

      const currentTerrainSource = map.getSource('terrain');
      if (!currentTerrainSource) {
        map.addSource('terrain', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        map.setTerrain({ 'source': 'terrain', 'exaggeration': 1.5 });
      }
    }
  }, [map, section]);

  const elevGainFeetDisplay = parseInt(metersToFeet(diffElevation).toFixed(), 10).toLocaleString();
  const elevGainMetersDisplay = parseInt(diffElevation.toFixed()).toLocaleString();

  const maxElevFeetDisplay = parseInt(metersToFeet(maxElevation).toFixed(0)).toLocaleString();
  const maxElevMetersDisplay = parseInt(maxElevation.toFixed(0)).toLocaleString();

  return (
    <>
      <Head>
        <title>Every Mile - {name} Mile {mile}</title>
        <meta property="og:image" content={getOgImageUrl(path, mile)}/>
      </Head>
      <section className="">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-700 sm:text-4xl md:text-5xl xl:text-6xl">
            {name}
          </h2>
          <h2 className="text-3xl font-extrabold tracking-tight text-green-600 sm:text-4xl md:text-5xl xl:text-6xl">
            Mile {mile}
          </h2>
          <div className="mt-5">
            {
              adjacentMiles
            }
          </div>
          <p className="mt-5 md:w-1/2 mx-auto">Mile {mile} of the {name} is located near <strong>{geocodeToLocationString(geocode)}</strong>. It has an elevation change of <strong>{elevGainFeetDisplay} ft ({elevGainMetersDisplay} m)</strong> with a maximum elevation of <strong>{maxElevFeetDisplay} ft ({maxElevMetersDisplay} m)</strong>.</p>
          <div className="map-container shadow-xl rounded-lg mt-5 mb-10" style={{height: 'calc(100vh - 200px)'}}>
            <MapboxMap
              initialOptions={{
                center: geometry.coordinates[0],
                zoom: 14,
                style: `mapbox://styles/${MAP_IDS[path]}`
              }}
              onLoaded={(map) => {
                setMap(map);
                map.loadImage('https://www.everymile.xyz/images/chevron.png', (error, image) => {
                  if (error || !image) {
                    return;
                  };
                  map.addImage('direction-marker', image);
                });
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return new Promise((resolve) => {
    const paths = [];

    const atPaths = Array(DISTANCES.at).fill(1).map((_, index) => ( { params: { path_slug: 'appalachian-trail', mile: (index + 1).toString() }}));
    const brpPaths = Array(DISTANCES.brp).fill(1).map((_, index) => ( { params: { path_slug: 'blue-ridge-parkway', mile: (index + 1).toString() }}));

    paths.push(...atPaths, ...brpPaths);

    resolve({
      paths,
      fallback: false
    })
  });
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const serialized = serializePathIdentifierAndMile(params as ParsedUrlQuery);

  if (serialized) {
    const path = getFilePath(serialized.path, serialized.mile, 'geojson');
    const file = fs.readFileSync(path);
    const section = JSON.parse(file.toString());
    const { properties } = section;

    return {
      props: {
        section,
        geocode: properties.geocode,
        minElevation: properties.min_elevation,
        maxElevation: properties.max_elevation,
        diffElevation: properties.elevation_difference
      }
    };
  }

  return { props: {} }
}

export default Mile;
