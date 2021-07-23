const getFilePath = (mile: number) => {
  const fileName = `mile_${mile.toString().padStart(3, '0')}.geojson`
  return `${__dirname}/../../geom/${fileName}`;
};

export { getFilePath };
