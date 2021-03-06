/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Aws, LogConfig, TileMetadataImageryRecord, TileMetadataSetRecord, TileSetTag } from '@basemaps/lambda-shared';
import * as chalk from 'chalk';
import { CliTable } from '../cli.table';
import { TileSetBaseAction } from './tileset.action';
import { printTileSet, TileSetTable } from './tileset.util';

const MaxHistory = 199;

export class TileSetHistoryAction extends TileSetBaseAction {
    public constructor() {
        super({
            actionName: 'log',
            summary: 'Show rendering history for a tileset',
            documentation: '',
        });
    }

    async getAllTags(): Promise<Map<TileSetTag, TileMetadataSetRecord>> {
        const tileSet = this.tileSet.value!;
        const projection = this.projection.value!;
        const allTags: Map<TileSetTag, TileMetadataSetRecord> = new Map();
        await Promise.all(
            Object.values(TileSetTag).map(async (tag) => {
                try {
                    const value = await Aws.tileMetadata.TileSet.get(tileSet, projection, tag);
                    allTags.set(tag, value);
                } catch (e) {}
            }),
        );

        return allTags;
    }

    protected async onExecute(): Promise<void> {
        const tileSetName = this.tileSet.value!;
        const projection = this.projection.value!;

        const allTags = await this.getAllTags();

        const tsData = allTags.get(TileSetTag.Head);
        if (tsData == null) throw new Error('Unable to find tag: head');

        printTileSet(tsData, false);

        const latestVersion = tsData.revisions ?? 0;
        const startVersion = Math.max(latestVersion - MaxHistory, 0);

        const toFetch = new Set<string>();
        for (let i = latestVersion; i >= startVersion; i--) {
            toFetch.add(Aws.tileMetadata.TileSet.id(tileSetName, projection, i));
        }

        function getTagsForVersion(version: number): string {
            return Object.values(TileSetTag)
                .filter((c) => allTags.get(c)?.version == version)
                .join(', ');
        }

        LogConfig.get().debug({ count: toFetch.size }, 'Loading TileSets');
        const tileSets = await Aws.tileMetadata.batchGet<TileMetadataSetRecord>(toFetch);
        const toFetchImages = new Set<string>();
        for (const tag of tileSets.values()) {
            for (const imId of Object.keys(tag.imagery)) toFetchImages.add(imId);
        }

        LogConfig.get().debug({ count: toFetchImages.size }, 'Loading Imagery');
        const imagery = await Aws.tileMetadata.batchGet<TileMetadataImageryRecord>(toFetchImages);

        const TileSetHistory = new CliTable<TileMetadataSetRecord>();
        TileSetHistory.field('v', 4, (obj) => `v${obj.version}`);
        TileSetHistory.field('CreatedAt', 40, (obj) => new Date(obj.createdAt).toISOString());
        TileSetHistory.field('Tags', 40, (obj) => getTagsForVersion(obj.version));

        console.log('History:');
        TileSetHistory.header();

        for (let i = latestVersion; i >= startVersion; i--) {
            const tileSetId = Aws.tileMetadata.TileSet.id(tileSetName, projection, i);
            const tileSetA = tileSets.get(tileSetId);
            if (tileSetA == null) throw new Error(`Failed to fetch tag: ${tileSetId}`);
            console.log(TileSetHistory.line(tileSetA));

            if (i == startVersion) continue;

            const tileSetBId = Aws.tileMetadata.TileSet.id(tileSetName, projection, i - 1);
            const tileSetB = tileSets.get(tileSetBId);
            if (tileSetB == null) throw new Error(`Failed to fetch tag: ${tileSetBId}`);

            this.showDiff(tileSetA, tileSetB, imagery);
        }
    }

    showDiff(
        tsA: TileMetadataSetRecord,
        tsB: TileMetadataSetRecord,
        imagery: Map<string, TileMetadataImageryRecord>,
    ): void {
        for (const tsAImg of Object.values(tsA.imagery)) {
            const tsBImg = tsB.imagery[tsAImg.id];
            const img = imagery.get(tsAImg.id)!;
            const lineA = TileSetTable.line({ rule: tsAImg, img });

            if (tsBImg == null) {
                console.log(chalk.green('\t+', lineA));
                continue;
            }

            const lineB = TileSetTable.line({ rule: tsBImg, img });
            if (lineA !== lineB) {
                console.log(chalk.green('\t+', lineA));
                console.log(chalk.red('\t-', lineB));
            }
        }

        for (const tsBImg of Object.values(tsB.imagery)) {
            const tsAImg = tsA.imagery[tsBImg.id];
            const img = imagery.get(tsBImg.id)!;

            if (tsAImg == null) {
                const lineA = TileSetTable.line({ rule: tsBImg, img });
                console.log(chalk.red('\t-', lineA));
            }
        }
        console.log();
    }
}
