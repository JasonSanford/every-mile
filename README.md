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
A series of scripts are run on a GeoJSON file representing the entire length of a trail. The following steps assume you have added a new trail's full geometry as `all.geojson` in the `/geom/{identifier}` directory, where `identifier` is a short string representing the trail's name (`at` => `Appalachian Trail`, `brp`, `Blue Ridge Parkway`).

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
