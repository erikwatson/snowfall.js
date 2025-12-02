import { Graphics } from '@erikwatson/bramble';
import { IImageLayer, ImageLayerConfig } from '../types';
import { BaseLayer } from './base-layer';
export declare class ImageLayer extends BaseLayer<ImageLayerConfig> implements IImageLayer {
    mode: 'image';
    image: HTMLImageElement;
    constructor(config: ImageLayerConfig, width: number, height: number, strength: number, durationIn: number, windDelayIn: number, durationOut: number, windDelayOut: number, changeChance: number);
    setImage(image: string): void;
    render(gfx: Graphics): void;
}
