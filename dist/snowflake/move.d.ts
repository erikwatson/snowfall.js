import { Vec2 } from '@erikwatson/bramble';
import { Snowflake } from '../types';
export declare function addWind(snowflake: Snowflake, angle: number, strength: number): void;
export declare function addRotation(snowflake: Snowflake, dt: number): void;
export declare function addGravity(snowflake: Snowflake, angle: number, strength: number): void;
export declare function addSwayMotion(snowflake: Snowflake, gravity: {
    angle: number;
    strength: number;
}, sway: {
    frequency: number;
    amplitude: number;
}): void;
export declare function addScrollMotion(position: Vec2, deltaX: number, deltaY: number): void;
export declare function fadeIn(snowflake: Snowflake): void;
export declare function screenWrap(snowflake: Snowflake, width: number, height: number): boolean;
