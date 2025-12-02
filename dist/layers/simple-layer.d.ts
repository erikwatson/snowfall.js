import { Graphics } from '@erikwatson/bramble';
import { ISimpleLayer, SimpleLayerConfig } from '../types';
import { BaseLayer } from './base-layer';
export declare class SimpleLayer extends BaseLayer<SimpleLayerConfig> implements ISimpleLayer {
    mode: 'simple';
    setColour(colour: string): void;
    render(gfx: Graphics): void;
}
