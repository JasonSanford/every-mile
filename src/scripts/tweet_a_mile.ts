import fs from 'fs';
import Twitter from 'twitter-lite';

import { DISTANCE_MILES } from '../constants';
import { getFilePath } from './utils';

const client = new Twitter({
  // subdomain: "api", // "api" is the default (change for other subdomains)
  // version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: 'U6fkvXwsiznoaFXTXZlwCHCHv', // from Twitter.
  consumer_secret: 'JK4WB2oWB7EI5652Ifi6zxC6EncQILVJ6ZXq7VsUmvDuZKtzJ5', // from Twitter.
  access_token_key: '1418647231897509888-8rzIS3f1M0yCIYgtx2t2H9uNXqhq7i', // from your User (oauth_token)
  access_token_secret: 'vGBjSPye2L5ZNmTgwXCuMAWCyWTCHLnIrnRps3vL48NlO' // from your User (oauth_token_secret)
});

for (let mile = 1; mile <= DISTANCE_MILES; mile++) {
  console.log(`Processing mile ${mile}`);

  const filePath = getFilePath(mile, 'geojson');
  const file = fs.readFileSync(filePath);
  const section = JSON.parse(file.toString());
  
  if (!section.properties.has_tweeted) {
    console.log(`Tweet mile ${mile}`);
    section.properties.has_tweeted = true;
    fs.writeFileSync(filePath, JSON.stringify(section));
    //   client.post("statuses/update", {
    //     status: `Hello world ${mile}`
    //   })
    //   .then(resp => console.log(resp))
    //   .catch(err => console.log(err));
    break;
  }
}
