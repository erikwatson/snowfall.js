import { Snowflake } from '../types';
export declare function addWind(snowflake: Snowflake, angle: number, strength: number): void;
export declare function addGravity(snowflake: Snowflake, angle: number, strength: number): void;
export declare function addWaveMotion(snowflake: Snowflake, gravity: {
    angle: number;
    strength: number;
}, wave: {
    frequency: number;
    amplitude: number;
}, dt: number): void;
export declare function fadeIn(snowflake: Snowflake): void;
export declare function screenWrap(snowflake: Snowflake, width: number, height: number): void;
