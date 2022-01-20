import fs from 'fs';
import { useEffect, useRef } from 'react';
import { GetStaticProps, GetServerSideProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import turfBuffer from '@turf/buffer';
import mapboxgl, {LngLatLike, MapboxGeoJSONFeature } from 'mapbox-gl';

import { DISTANCES } from '../../../constants';
import { serializePathIdentifierAndMile, pathIdentifierToName, getOgImageUrl } from '../../../utils';
import { ParsedUrlQuery } from 'querystring';
import { getFilePath, getBufferDistance } from '../../../scripts/utils';

mapboxgl.accessToken = 'pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrZG1kdnU5NzE3bG4yenBkbzU5bDQ2NXMifQ.IMquilPKSANQDaSzf3fjcg';

type LineString = {
  type: string;
  coordinates: LngLatLike[];
}

type PolygonFeature = {
  type: 'Feature';
  geometry: {
    type: 'Polygon',
    coordinates: LngLatLike[][]
  };
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

  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) {
      return;
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/jcsanford/cks3bzm7c1ylb17nz0zp4fted',
      center: lineString.coordinates[0],
      zoom: 14
    });

    map.current?.on('load', () => {
      const bounds = new mapboxgl.LngLatBounds(
        lineString.coordinates[0],
        lineString.coordinates[0]
      );

      for (const coord of lineString.coordinates) {
        bounds.extend(coord);
      }

      map.current?.addSource('mile', {
        type: 'geojson',
        data: buffer
      });

      map.current?.addLayer({
        'id': 'mile-fill-layer',
        'type': 'fill',
        'source': 'mile',
        'paint': {
          'fill-opacity': 0.4,
          'fill-color': '#e0e0e0',
        }
      });

      map.current?.addLayer({
        'id': 'mile-line-layer',
        'type': 'line',
        'source': 'mile',
        'paint': {
          'line-opacity': 1,
          'line-color': '#999999',
          'line-width': 2
        }
      });

      map.current?.fitBounds(bounds, {
        padding: 100
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Every Mile - {name} Mile {mile}</title>
        <meta property="og:image" content={getOgImageUrl(path, mile)}/>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <section className="py-20 bg-white">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-700 sm:text-4xl md:text-5xl xl:text-6xl">
            {name}
          </h2>
          <h2 className="text-3xl font-extrabold tracking-tight text-green-600 sm:text-4xl md:text-5xl xl:text-6xl">
            Mile {mile}
          </h2>
          <div ref={mapContainer} className="map-container" style={{height: 'calc(100vh - 200px)'}}></div>
        </div>
      </section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return new Promise((resolve) => {
    const paths = [];

    const atPaths = Array(DISTANCES.at).fill(1).map((_, index) => ( { params: { path_slug: 'appalachian-trail', mile: (index + 1).toString() }}));

    paths.push(...atPaths);
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
