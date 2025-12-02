import { Snowflake } from '../types';
export declare function addWind(snowflake: Snowflake, angle: number, strength: number): void;
export declare function addRotation(snowflake: Snowflake): void;
export declare function addGravity(snowflake: Snowflake, angle: number, strength: number): void;
export declare function addSwayMotion(snowflake: Snowflake, gravity: {
    angle: number;
    strength: number;
}, sway: {
    frequency: number;
    amplitude: number;
}): void;
export declare function fadeIn(snowflake: Snowflake): void;
export declare function screenWrap(snowflake: Snowflake, width: number, height: number, gravity: {
    angle: number;
    strength: number;
}): void;
