import fs from 'fs';
import { useEffect, useRef } from 'react';
import { GetStaticProps, GetServerSideProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
// @ts-ignore
import mapboxgl from '!mapbox-gl';

import { DISTANCES } from '../../../constants';
import { serializePathIdentifierAndMile, pathIdentifierToName } from '../../../utils';
import { ParsedUrlQuery } from 'querystring';
import { getFilePath } from '../../../scripts/utils';

mapboxgl.accessToken = 'pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrZG1kdnU5NzE3bG4yenBkbzU5bDQ2NXMifQ.IMquilPKSANQDaSzf3fjcg';

type MileProps = {
  coordinates: number[]
};

const Mile = ({
  coordinates
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
  const map = useRef(null);
  // const [lng, setLng] = useState(-70.9);
  // const [lat, setLat] = useState(42.35);
  // const [zoom, setZoom] = useState(9);
  useEffect(() => {
    if (map.current) {
      return;
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      // center: [-70.9, 42.35],
      center: coordinates,
      zoom: 14
    });
  }, []);

  return (
    <>
      <Head>
        <title>Every Mile - {name} Mile {mile}</title>
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
    console.log(serialized.mile);
    const path = getFilePath(serialized.path, serialized.mile, 'geojson');
    const file = fs.readFileSync(path);
    const section = JSON.parse(file.toString());
    console.log(section.geometry.coordinates[0]);
    return {
      props: {
        coordinates: section.geometry.coordinates[0]
      }
    }
  }
  console.log('slug', params?.path_slug)
  return {
    props: {

    }
  }
}

export default Mile;
