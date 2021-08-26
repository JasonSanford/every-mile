# every-mile

A collection of twitter bots that sequentially post every mile of a trail, road, or path to Twitter.

## Active Bots

| Path | Distance |
| ----------- | ----------- |
| [Appalachian Trail](https://twitter.com/every_mile_at) | 2120 |
| [Blue Ridge Parkway](https://twitter.com/every_mile_brp) | 469 |


<a href="https://twitter.com/every_mile_brp">
  <img alt="Twitter Follow badge" src="https://img.shields.io/twitter/url?label=%40every_mile_brp&style=social&url=https%3A%2F%2Ftwitter.com%2Fevery_mile_brp">
</a>

<a href="https://twitter.com/every_mile_at">
  <img alt="Twitter Follow badge" src="https://img.shields.io/twitter/url?label=%40every_mile_at&style=social&url=https%3A%2F%2Ftwitter.com%2Fevery_mile_at">
</a>

## How it works

### Prepping a bot
A series of scripts are run on a GeoJSON file representing the entire length of a trail. The following steps assume you have:

1. added a new trail's full geometry as `all.geojson` in the `/geom/{identifier}` directory, where `identifier` is a short string representing the trail's name (`at` => `Appalachian Trail`, `brp` => `Blue Ridge Parkway`).
2. Added constants for this new trail in `/src/constants.ts` including total trail distance, Mapbox map id, and mile indicator buffer (seen on images).

#### `01_create_mile_sections`

This walks the entire trail geometry mile-by-mile and creates `.geojson` files for each, represented as a [GeoJSON Feature](https://datatracker.ietf.org/doc/html/rfc7946#section-3.2). Initially the `properties` for this feature is an empty object, to be populated by subsequent scripts.

A trail identifier must be passed as a parameter when running this script.

```sh
node dist/scripts/01_create_mile_sections.js at
```

#### `02_add_city_property`

This iterates every mile of the trail by reading its GeoJSON Feature (`/geom/{identifier}/mile_{number}.geojson)`. Once the trail is loaded we use Mapbox's [reverse geocode](https://docs.mapbox.com/api/search/geocoding/#reverse-geocoding) API to convert the first coordinate's (start of mile) latitude and longitude into a set of place identifiers. The API returns an array of definitions for how to describe this place (country, city, park, zip code, etc). Instead of parsing and processing all of these definitions in this step we just save them all to be processed at time-of-post. [Async's series](https://caolan.github.io/async/v3/docs.html#series) is used together with `setTimeout` to (hopefully) keep from hammering the API and getting a bad response.

A trail identifier must be passed as a parameter when running this script.

```sh
node dist/scripts/02_add_city_property.js at
```

#### `03_add_elevations`

Again, iterating each mile one at a time we `series` and `setTimeout` to rate-limit requests to the Mapbox API. This is the most complex of the scripts. It iterates over each coordinate in the LineString representing the mile and adds a new `elevations` member of `properties` representing the elevation for each coordinate. This works by using Mapbox's [Terrain-RGB](https://docs.mapbox.com/help/troubleshooting/access-elevation-data/#mapbox-terrain-rgb) data set and doing some clever tile math over in `/src/elevation.ts`. The cleverness wasn't mine, but I borrowed it from [this repo](https://github.com/mcwhittemore/mapbox-elevation). I simply added the ability to cache tiles so that we didn't make an API request for every single coordinate over a trail thousands of miles long.

A trail identifier must be passed as a parameter when running this script.

```sh
node dist/scripts/03_add_elevations.js at
```

#### `04_add_elevation_stats`

This step simply uses the elevation data from the previous step and does some simple math to find minimum elevation, maximum elevation, and total elevation gain (or loss).

A trail identifier must be passed as a parameter when running this script.

```sh
node dist/scripts/04_add_elevation_stats.js at
```

#### `05_generate_maps`

Using the same rate-limiting in the previous steps, iterate through each mile and use the Mapbox API to create a static map image and save to disk. The only interesting thing we are doing here is creating a small buffer around this LineString representation of a mile, creating a Polygon, and displaying that on the map. Each map image is saved to disk under `/images/{identifier}/mile_{number}.png`. It's easier to go ahead and pre-render these so that each Github action job runs quickly. After this step is done we're almost ready to post.

A trail identifier must be passed as a parameter when running this script.

```sh
node dist/scripts/05_generate_maps.js at
```

## Extra

For each post the bot looks for a gif before the png. Some mile sections are particularly interesting and look great when animated. If a gif is found it takes priority and is shown instead of the png.
