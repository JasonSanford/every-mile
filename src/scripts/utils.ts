const getFilePath = (mile: number, extension: string) => {
  const directory = extension === 'geojson' ? 'geom' : 'images';
  const fileName = `mile_${mile.toString().padStart(3, '0')}.${extension}`
  return `${__dirname}/../../${directory}/${fileName}`;
};

export { getFilePath };
