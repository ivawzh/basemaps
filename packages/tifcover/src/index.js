const Mercator = require('global-mercator');
const MapBoxCover = require('@mapbox/tile-cover');
const { QuadKey } = require('@basemaps/geo');
const { EPSG, GeoJson, Projection } = require('@basemaps/geo');
const proj = require('./proj');

const fs = require('fs');

const CogSourceFile = require('@cogeotiff/source-file').CogSourceFile;

// const BaseFolder = `/home/blacha/tif/small/`;
const BaseFolder = `/home/blacha/tif/2019-new-zealand-sentinel/`;
// const BaseFolder = `/media/blacha/BlayneDrive/tif/gisborne_0.1m_urban_2017-2018/`;
// const BaseFolder = `/media/blacha/BlayneDrive/tif/gisborne_0.3m_rural_2017-2018/`;

const Proj256 = new Projection(256);

function getTiffResolution(tiff) {
    const image = tiff.getImage(0);

    // Get best image resolution
    const [resX] = image.resolution;
    let z = 30;
    while (z > 0) {
        const currentZoom = Proj256.getResolution(z);
        if (currentZoom >= resX) {
            break;
        }
        z--;
    }
    return z;
}

function tiffBounds(tif) {
    const image = tif.getImage(0);

    const bbox = image.bbox;
    const topLeft = [bbox[0], bbox[3]];
    const topRight = [bbox[2], bbox[3]];
    const bottomRight = [bbox[2], bbox[1]];
    const bottomLeft = [bbox[0], bbox[1]];

    const projProjection = proj.getProjection(EPSG.Nztm);
    if (projProjection == null) {
        throw new Error('Invalid tiff projection: ' + projection);
    }

    const coordinates = [
        [
            projProjection.inverse(topLeft),
            projProjection.inverse(bottomLeft),
            projProjection.inverse(bottomRight),
            projProjection.inverse(topRight),
            projProjection.inverse(topLeft),
        ],
    ];

    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates,
        },
        properties: { name: tif.source.name },
    };
}

function qkToGeoJson(quadKey) {
    const bbox = Mercator.googleToBBox(Mercator.quadkeyToGoogle(quadKey));
    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [bbox[0], bbox[1]],
                    [bbox[0], bbox[3]],
                    [bbox[2], bbox[3]],
                    [bbox[2], bbox[1]],
                    [bbox[0], bbox[1]],
                ],
            ],
        },
        properties: { quadKey },
    };
}

function toMultiPolygon(features) {
    let coordinates = [];
    for (const feature of features) {
        if (feature.geometry.type == 'Polygon') {
            coordinates.push(feature.geometry.coordinates);
        }
        if (feature.geometry.type == 'MultiPolygon') {
            coordinates = coordinates.concat(feature.geometry.coordinates);
        }
    }

    return {
        type: 'MultiPolygon',
        coordinates,
    };
}

function refineCovering(currentQk, indexes, resolution, output = []) {
    for (const child of QuadKey.children(currentQk)) {
        const percent = QuadKey.coveringPercent(child, indexes);
        if (percent == 0) continue;
        if (percent > 0.8 || currentQk.length > resolution) {
            //   console.log("covering", child, percent);

            output.push({ quadKey: child, cover: percent });
            continue;
        }

        refineCovering(child, indexes, resolution, output);
    }
    return output;
}

class CoveringFinder {
    constructor(features, resolution) {
        this.features = features;
        this.resolution = resolution;

        const searchGeom = toMultiPolygon(features);
        this.indexes = MapBoxCover.indexes(searchGeom, {
            min_zoom: 1,
            max_zoom: resolution - 2,
        })
            .filter((f) => f != '')
            // Make sure the biggest tiles are first
            .sort((a, b) => a.length - b.length)
            // If an earlier tile already covers this region, we don't need this tile
            .filter((f, index, ary) => {
                for (let i = 0; i < index; i++) {
                    if (QuadKey.intersects(f, ary[i])) {
                        return false;
                    }
                }
                return true;
            })
            .sort((a, b) => {
                if (a.length == b.length) {
                    return a.localeCompare(b);
                }
                return a.length - b.length;
            });
        fs.writeFileSync(
            './cover.geojson',
            JSON.stringify({
                type: 'FeatureCollection',
                features: this.indexes.map(qkToGeoJson),
            }),
        );
    }

    cover() {
        const targetResolution = this.resolution - 7;
        console.log('Indexes', this.indexes.length);
        // for (let i = Math.max(0, this.resolution - 10); i < this.resolution; i++) {
        const output = refineCovering('', this.indexes, targetResolution);
        const avgCover = output.map((c) => c.cover).reduce((a, b) => a + b, 0) / output.length;
        // console.log(output);
        console.log(targetResolution, avgCover, output.length);

        // if (avgCover > 0.4) {
        const quadKeys = output.map((c) => c.quadKey);
        const simple = QuadKey.simplify(quadKeys);
        console.log(targetResolution, quadKeys.length, 'vs', simple.length, simple);
        return simple;
        // }
        // }
    }
}

async function main() {
    const tifsInit = fs
        .readdirSync(BaseFolder)
        .filter((f) => f.toLowerCase().endsWith('.tif'))
        .map((c) => CogSourceFile.create(`${BaseFolder}/${c}`));

    const tifs = await Promise.all(tifsInit);
    console.log('Tiff Count', tifs.length);

    let resolution = -1;
    const features = [];
    for (const tif of tifs) {
        const res = getTiffResolution(tif);
        if (res > resolution) resolution = res;

        const bounds = tiffBounds(tif);
        features.push(bounds);
    }

    fs.writeFileSync('./bounds.geojson', JSON.stringify({ type: 'FeatureCollection', features }));

    const covering = new CoveringFinder(features, resolution);
    const cover = covering.cover().map(qkToGeoJson);

    fs.writeFileSync('./result.geojson', JSON.stringify({ type: 'FeatureCollection', features: cover }));
    console.log(cover.length);
}

main().catch(console.error);
