import * as React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, 'container'>;
  onCreated?(map: mapboxgl.Map): void;
  onLoaded?(map: mapboxgl.Map): void;
  onRemoved?(): void;
}

const MapboxMap = ({
  initialOptions = {},
  onCreated,
  onLoaded,
  onRemoved,
}: MapboxMapProps) => {
  const [map, setMap] = React.useState<mapboxgl.Map>();

  const mapNode = React.useRef(null);

  React.useEffect(() => {
    const node = mapNode.current;

    if (typeof window === 'undefined' || node === null) {
      return;
    }

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: 'pk.eyJ1IjoiamNzYW5mb3JkIiwiYSI6ImNrZG1kdnU5NzE3bG4yenBkbzU5bDQ2NXMifQ.IMquilPKSANQDaSzf3fjcg',
      center: [-74.5, 40],
      zoom: 9,
      ...initialOptions,
    });

    setMap(mapboxMap);
    if (onCreated) onCreated(mapboxMap);

    if (onLoaded) {
      mapboxMap.once('load', () => onLoaded(mapboxMap));
    }

    return () => {
      mapboxMap.remove();
      setMap(undefined);

      if (onRemoved) {
        onRemoved();
      }
    };
  }, []);

  return <div ref={mapNode} style={{ width: '100%', height: '100%' }} />;
}

export default MapboxMap;
