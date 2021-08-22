const extensionDirMap = {
  geojson: 'geom',
  png: 'images',
  gif: 'images',
};

type Extension = 'geojson' | 'png' | 'gif';

const getFilePath = (mile: number, extension: Extension) => {
  const directory = extensionDirMap[extension];
  const fileName = `mile_${mile.toString().padStart(4, '0')}.${extension}`
  return `${__dirname}/../../${directory}/${fileName}`;
};

const metersToFeet = (meters: number) => {
  return meters * 3.28084;
}

export { getFilePath, metersToFeet };
