import fs from 'fs';
import { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import turfBuffer from '@turf/buffer';
import mapboxgl, { GeoJSONSource, LngLatLike, MapboxGeoJSONFeature } from 'mapbox-gl';

import { DISTANCES, MAP_IDS } from '../../../constants';
import { serializePathIdentifierAndMile, pathIdentifierToName, getOgImageUrl, getMileUrl } from '../../../utils';
import { ParsedUrlQuery } from 'querystring';
import { getFilePath, getBufferDistance } from '../../../scripts/utils';
import Link from 'next/link';
import MapboxMap from '../../../components/MapboxMap';

type LineString = {
  type: string;
  coordinates: LngLatLike[];
}

type MileProps = {
  lineString: LineString;
  buffer: MapboxGeoJSONFeature;
};

const Mile = ({
  lineString, buffer
}: MileProps) => {
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
      <Link href={getMileUrl(path, previousMile)}>
        <button className="rounded-full">&larr; Previous Mile ({previousMile})</button>
      </Link>
    )
  }

  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  if (mile !== DISTANCES[path]) {
    const nextMile = mile + 1;

    adjacentMiles.push(
      <Link href={getMileUrl(path, nextMile)}>
        <button className="rounded-full">Next Mile ({nextMile}) &rarr;</button>
      </Link>
    )
  }

  if (adjacentMiles.length === 2) {
    adjacentMiles.splice(1, 0, <span>&nbsp;|&nbsp;</span>);
  }

  useEffect(() => {
    // if (map.current || !mapContainer.current) {
    //   return;
    // }
    // map.current = new mapboxgl.Map({
    //   // @ts-ignore
    //   container: mapContainer.current,
    //   style: `mapbox://styles/${MAP_IDS[path]}`,
    //   center: lineString.coordinates[0],
    //   zoom: 14
    // });

    if (map) {
      const bounds = new mapboxgl.LngLatBounds(
        lineString.coordinates[0],
        lineString.coordinates[0]
      );

      for (const coord of lineString.coordinates) {
        bounds.extend(coord);
      }

      map.fitBounds(bounds, { padding: 100 });

      const currentSource = map.getSource('mile');
      if (currentSource) {
        (currentSource as GeoJSONSource).setData(buffer);
      } else {
        map.addSource('mile', {
          type: 'geojson',
          data: buffer
        });
      }

      const currentFillLayer = map.getLayer('mile-fill-layer');
      const currentLineLayer = map.getLayer('mile-line-layer');

      if (!currentFillLayer) {
        map.addLayer({
          'id': 'mile-fill-layer',
          'type': 'fill',
          'source': 'mile',
          'paint': {
            'fill-opacity': 0.4,
            'fill-color': '#e0e0e0',
          }
        });
      }

      if (!currentLineLayer) {
        map.addLayer({
          'id': 'mile-line-layer',
          'type': 'line',
          'source': 'mile',
          'paint': {
            'line-opacity': 1,
            'line-color': '#999999',
            'line-width': 2
          }
        });
      }
    }
  }, [lineString, buffer]);

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
          {
            adjacentMiles
          }
          <div className="map-container shadow-xl rounded-lg mt-5 mb-10" style={{height: 'calc(100vh - 200px)'}}>
            <MapboxMap
              initialOptions={{
                center: lineString.coordinates[0],
                zoom: 14,
                style: `mapbox://styles/${MAP_IDS[path]}`
              }}
              onLoaded={(map) => setMap(map)}
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
    const buffer = turfBuffer(section.geometry, getBufferDistance(serialized.path));
    const { geometry: lineString } = section;

    return {
      props: {
        lineString,
        buffer
      }
    };
  }

  return { props: {} }
}

export default Mile;
