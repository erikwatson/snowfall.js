import { BaseLayerConfig, ConfigLayer, ImageLayerConfig, SimpleLayerConfig, UserSchedule } from './types';
export declare function getElementOrThrow(id: string): HTMLElement;
export declare function withinSchedule(schedule: UserSchedule): boolean;
export declare function requiredSnowflakes(width: number, height: number, density: number): number;
export declare function clone(obj: any): any;
export declare function makeSnowflakes(num: number, config: BaseLayerConfig | SimpleLayerConfig | ImageLayerConfig, width: number, height: number): {
    position: import("@erikwatson/bramble").Vec2;
    mass: number;
    size: number;
    renderedSize: number;
    noise: number;
    amplitude: number;
    frequency: number;
    random: number;
    rotation: number;
    time: number;
    opacity: number;
}[];
export declare function isSimpleLayer(layer: ConfigLayer): layer is SimpleLayerConfig;
