import { ConfigLayer, UserSchedule } from './types';
export declare function getElementOrThrow(id: string): HTMLElement;
export declare function withinSchedule(schedule: UserSchedule): boolean;
export declare function requiredSnowflakes(width: number, height: number, density: number): number;
export declare function clone(obj: any): any;
export declare function makeSnowflakes(num: number, config: ConfigLayer, width: number, height: number): {
    position: import("@erikwatson/bramble").Vec2;
    size: number;
    renderedSize: number;
    noise: number;
    amplitude: number;
    frequency: number;
    random: number;
    time: number;
    colour: string;
}[];
