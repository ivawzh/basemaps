import { BoundingBox, Size } from '@basemaps/geo';
import * as Sharp from 'sharp';
import { TileMaker, ImageFormat, TileMakerContext } from '@basemaps/tiler';
import { Metrics } from '@basemaps/metrics';

export interface Composition {
    /** Tiff Id */
    id: string;
    /** Image buffer */
    getBuffer: () => Promise<Buffer>;
    /** Point to draw the image at on the output bounds */
    x: number;
    y: number;
    /** Crop the initial bounds */
    extract?: Size;
    /** Resize the buffer */
    resize?: Size;
    /** Crop after the resize */
    crop?: BoundingBox;
}

function notEmpty<T>(value: T | null | undefined): value is T {
    return value != null;
}
export type SharpOverlay = { input: string | Buffer } & Sharp.OverlayOptions;

const SharpScaleOptions = { fit: Sharp.fit.cover };

export class TileMakerSharp implements TileMaker {
    static readonly MaxImageSize = 256 * 2 ** 15;
    private tileSize: number;
    /** The background of all tiles that are created, slightly light blue*/
    public background = { r: 0xdc, g: 0xe9, b: 0xed, alpha: 1 };

    public constructor(tileSize: number) {
        this.tileSize = tileSize;
    }

    protected isTooLarge(composition: Composition): boolean {
        if (composition.resize) {
            if (composition.resize.width >= TileMakerSharp.MaxImageSize) {
                return true;
            }
            if (composition.resize.height >= TileMakerSharp.MaxImageSize) {
                return true;
            }
        }

        return false;
    }

    private async getImageBuffer(layers: SharpOverlay[], format: ImageFormat): Promise<Buffer> {
        const pipeline = this.createImage().composite(layers);
        switch (format) {
            case ImageFormat.JPEG:
                return pipeline.jpeg().toBuffer();
            case ImageFormat.PNG:
                return pipeline.png().toBuffer();
            case ImageFormat.WEBP:
                return pipeline.webp().toBuffer();
            default:
                throw new Error(`Invalid image format "${format}"`);
        }
    }

    public async compose(ctx: TileMakerContext): Promise<{ buffer: Buffer; metrics: Metrics; layers: number }> {
        const metrics = new Metrics();
        // TODO to prevent too many of these running, it should ideally be inside of a two step promise queue
        // 1. Load all image bytes
        // 2. Create image overlays
        metrics.start('compose:overlay');
        const todo: Promise<SharpOverlay | null>[] = [];
        for (const comp of ctx.layers) {
            if (this.isTooLarge(comp)) {
                continue;
            }
            todo.push(this.composeTile(comp));
        }
        const overlays = await Promise.all(todo).then((items) => items.filter(notEmpty));
        metrics.end('compose:overlay');

        metrics.start('compose:compress');
        const buffer = await this.getImageBuffer(overlays, ctx.format);
        metrics.end('compose:compress');

        return { buffer, metrics, layers: overlays.length };
    }

    private async composeTile(composition: Composition): Promise<SharpOverlay | null> {
        const bytes = await composition.getBuffer();
        const sharp = Sharp(Buffer.from(bytes));

        // The stats function takes too long to run, its faster to just compose all the tiles anyway.
        // const stats = await sharp.stats();
        // const [red, green, blue] = stats.channels;
        // // If there is no color this tile is not really worth doing anything with
        // if (red.max == 0 && green.max == 0 && blue.max == 0) {
        //     // TODO this could be made to be much more smart in terms of excluding images from the rendering
        //     // If there is no area which has alpha then we may not need to compose all the tiles
        //     // so we could cut the rendering pipeline down
        //     return null;
        // }

        if (composition.extract) {
            sharp.extract({ top: 0, left: 0, width: composition.extract.width, height: composition.extract.height });
        }

        if (composition.resize) {
            sharp.resize(composition.resize.width, composition.resize.height, SharpScaleOptions);
        }

        if (composition.crop) {
            sharp.extract({
                top: composition.crop.y,
                left: composition.crop.x,
                width: composition.crop.width,
                height: composition.crop.height,
            });
        }

        const input = await sharp.toBuffer();
        return {
            input,
            top: composition.y,
            left: composition.x,
        };
    }

    private createImage(): Sharp.Sharp {
        return Sharp({
            create: {
                width: this.tileSize,
                height: this.tileSize,
                channels: 4,
                background: this.background,
            },
        });
    }
}
