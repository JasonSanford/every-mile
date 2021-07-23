import fs from 'fs';

import { series } from 'async'
import { getElevation } from '../elevation';

import { DISTANCE_MILES } from '../constants';
import { getFilePath } from './utils';

type CB = (error: Error | null, results: any) => void;

const tasks = [];

for (let mile = 401; mile <= DISTANCE_MILES; mile++) {
  tasks.push((cb: CB) => {
    setTimeout(() => {
      console.log(`Processing mile ${mile}`);

      const filePath = getFilePath(mile);
      const file = fs.readFileSync(filePath);
      const section = JSON.parse(file.toString());

      const elevationTasks = section.geometry.coordinates.map((coordinate: number[]) => {
        return (cb: CB) => {
          setTimeout(async () => {
            const [longitude, latitude] = coordinate;
            try {
              let elevation = await getElevation(latitude, longitude);
              elevation = parseFloat(elevation.toFixed(1))
              cb(null, elevation);
            } catch (error) {
              console.log('Error getting elevation', error);
              // Some elevation errors are ok, just add a null entry.
              cb(null, null);
            }
          }, 20);
        };
      });

      series(elevationTasks, (error, elevationResults) => {
        if (error) {
          console.log('error', error);
          return;
        }

        section.properties.elevations = elevationResults;
        fs.writeFileSync(filePath, JSON.stringify(section));
        cb(null, elevationResults);
      });
    }, 4000);
  });
}

series(tasks, (error, results) => {
  if (error) {
    console.log('error', error);
    return;
  }

  console.log(results.length);
});
