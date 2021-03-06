import { TileCover } from '@basemaps/geo';
import { MultiPolygon } from 'geojson';
import * as o from 'ospec';
import { Cutline } from '../cutline';
import { SourceMetadata } from '../types';
import { SourceTiffTestHelper } from './source.tiff.testhelper';

o.spec('covering', () => {
    const testDir = `${__dirname}/../../../__test.assets__`;
    o('loadCutline', async () => {
        const cutline = await Cutline.loadCutline(testDir + '/mana.geojson');
        const geojson = cutline.toGeoJson();
        const mp = geojson.features[0].geometry as MultiPolygon;
        const { coordinates } = mp;
        mp.coordinates = [];
        o(geojson).deepEquals({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [],
                    },
                    properties: {},
                },
            ],
        });
        o(coordinates.length).equals(2);
        o(coordinates[0][0][0]).deepEquals([174.78134935600005, -41.077634319065346]);
    });

    o('filterPolygons', async () => {
        const cutline = await Cutline.loadCutline(testDir + '/mana.geojson');

        const features = SourceTiffTestHelper.makeTiffFeatureCollection();

        o(cutline.polygons.length).equals(2);

        cutline.findCovering({ bounds: features, resolution: 18 } as SourceMetadata);

        o(cutline.polygons.length).equals(1);
    });

    o('optmize', async () => {
        const geoJson = SourceTiffTestHelper.makeTiffFeatureCollection();

        const cutline = new Cutline();

        const covering = cutline.optimizeCovering({ bounds: geoJson, resolution: 13 } as SourceMetadata);

        o(covering.size).equals(Array.from(covering).length);
        o(Array.from(covering)).deepEquals(['31133322', '31311100']);

        const covering2 = cutline.optimizeCovering({ bounds: geoJson, resolution: 18 } as SourceMetadata);

        o(covering2.size).equals(Array.from(covering2).length);

        o(Array.from(covering2)).deepEquals([
            '3113332222',
            '3113332223',
            '311333223202',
            '31133322322',
            '3131110000',
            '3131110001',
            '31311100100',
            '313111001020',
        ]);
    });

    o('optimize should not cover the world', () => {
        const bounds = TileCover.toGeoJson(['']);
        const cutline = new Cutline();
        const covering = cutline.optimizeCovering({ bounds, resolution: 0 } as SourceMetadata);
        o(Array.from(covering)).deepEquals(['0', '1', '2', '3']);
    });
});
