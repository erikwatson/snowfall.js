/**
 * @module snowfall
 */
import { UserConfig, UserSchedule } from './types';
/**
 * Starts the Snowfall simulation.
 *
 * @param {UserConfig} [config] - A config, possibly from the [Visual Config Editor](https://erikwatson.github.io/snowfall-editor/).
 */
export declare function start(config?: UserConfig): void;
/**
 * Starts the Snowfall simulation when today's date falls within the date range in the schedule.
 *
 * @param {UserSchedule} userSchedule - A schedule config, defining when the simulation should run from, and when the simulation should run to.
 * @param {UserConfig} [config] - A config, possibly from the [Visual Config Editor](https://erikwatson.github.io/snowfall-editor/).
 */
export declare function schedule(userSchedule: UserSchedule, config?: UserConfig): void;
/**
 * Set the background colour
 *
 * @param {string} colour - The background colour of the Canvas
 */
export declare function setBackground(colour: string): void;
/**
 * Set the colour of the Snowflakes
 * @param {string} colour - The colour to set
 * @param {number} layer - The layer to set the colour for
 */
export declare function setColour(colour: string, layer: number): void;
/**
 * Set the density of the Snowflakes. This is the number of snowflakes on screen
 * at a resolution of 1280 x 1080, but this number is scaled up and down at
 * higher and lower resolutions respectively to give a consistent look when
 * resizing.
 *
 * Setting this restarts the simulation.
 *
 * @param {number} density - A number representing the density of snowflakes.
 * @param {number} layer - The layer to set the density for
 */
export declare function setDensity(density: number, layer: number): void;
/**
 * Should the snowflakes grow in size from nothing until they reach their full
 * size? It happens pretty quickly.
 *
 * @param {boolean} value - Yes or no?
 * @param {number} layer - The layer to set the fade for
 */
export declare function setRespectOrientation(value: boolean, layer: number): void;
/**
 * Should the snowflakes grow in size from nothing until they reach their full
 * size? It happens pretty quickly.
 *
 * Setting this restarts the simulation.
 *
 * @param {boolean} value - Yes or no?
 * @param {number} layer - The layer to set the fade for
 */
export declare function setFade(value: boolean, layer: number): void;
/**
 * Set the Amplitude of the Wave motion of the Snowflakes
 *
 * @param {number} amplitude - The Amplitude to set
 * @param {number} layer - The layer to set the amplitude for
 */
export declare function setAmplitude(amplitude: number, layer: number): void;
/**
 * Set the Frequency of the Wave motion of the Snowflakes.
 *
 * @param {number} frequency - The frequency to set
 * @param {number} layer - The layer to set the frequency for
 */
export declare function setFrequency(frequency: number, layer: number): void;
/**
 * Set this to true to prevent the update.
 * Set it to true to continue from where we left off.
 *
 * @param {boolean} pause - If the simulation should be halted or not
 * @param {number} layer - The layer to set the paused state for
 */
export declare function setPaused(pause: boolean, layer: number): void;
/**
 * Pause/unpause the snowfall update loop
 */
export declare function togglePaused(layer: number): void;
/**
 * Set the angle and strength of the wind in the simulation.
 *
 * @param {number} angle - The angle of the wind, in degrees
 * @param {number} strength - The strength of the wind
 * @param {number} layer - The layer to set the wind for
 */
export declare function setWind(angle: number, strength: number, layer: number): void;
/**
 * Set the angle of the wind in the simulation.
 *
 * @param {number} angle - The angle of the wind, in degrees
 * @param {number} layer - The layer to set the wind angle for
 */
export declare function setWindAngle(angle: number, layer: number): void;
/**
 * Set the strength of the wind in the simulation.
 *
 * @param {number} strength - The strength of the wind
 */
export declare function setWindStrength(strength: number, layer: number): void;
/**
 * Set the wind gusts in the simulation.
 * This restarts the simulation.
 *
 * @param {boolean} gusts - Should there be gusts in the wind?
 * @param {number} layer - The layer to set the gusts for
 */
export declare function setGusts(gusts: boolean, layer: number): void;
/**
 * Set the angle and strength of gravity in the simulation.
 *
 * @param {number} angle - The angle of gravity, in degrees
 * @param {number} strength - The strength of the gravity
 * @param {number} layer - The layer to set the gravity for
 */
export declare function setGravity(angle: number, strength: number, layer: number): void;
/**
 * Set the angle of gravity in the simulation.
 *
 * @param {number} angle - The angle of gravity, in degrees
 * @param {number} layer - The layer to set the gravity angle for
 */
export declare function setGravityAngle(angle: number, layer: number): void;
/**
 * Set the strength of gravity in the simulation.
 *
 * @param {number} strength - The strength of the gravity
 * @param {number} layer - The layer to set the gravity strength for
 */
export declare function setGravityStrength(strength: number, layer: number): void;
/**
 * Set the minimum additional strength of the wind when it's coming in.
 *
 * @param {number} min - The minimum additional strength of the wind when it's coming in.
 * @param {number} layer - The layer to set the wind in additional strength min for
 * @returns {void}
 */
export declare function setWindInAdditionalStrengthMin(min: number, layer: number): void;
/**
 * Set the maximum additional strength of the wind when it's coming in.
 *
 * @param {number} max - The maximum additional strength of the wind when it's coming in.
 * @param {number} layer - The layer to set the wind in additional strength max for
 * @returns {void}
 */
export declare function setWindInAdditionalStrengthMax(max: number, layer: number): void;
/**
 * Set the minimum duration of the wind when it's coming in.
 *
 * @param {number} min - The minimum duration of the wind when it's coming in.
 * @param {number} layer - The layer to set the wind in duration min for
 * @returns {void}
 */
export declare function setWindInDurationMin(min: number, layer: number): void;
/**
 * Set the maximum duration of the wind when it's coming in.
 *
 * @param {number} max - The maximum duration of the wind when it's coming in.
 * @param {number} layer - The layer to set the wind in duration max for
 * @returns {void}
 */
export declare function setWindInDurationMax(max: number, layer: number): void;
/**
 * Set the minimum delay of the wind when it's coming in.
 *
 * @param {number} min - The minimum delay of the wind when it's coming in.
 * @param {number} layer - The layer to set the wind in delay min for
 * @returns {void}
 */
export declare function setWindInDelayMin(min: number, layer: number): void;
/**
 * Set the maximum delay of the wind when it's coming in.
 *
 * @param {number} max - The maximum delay of the wind when it's coming in.
 * @param {number} layer - The layer to set the wind in delay max for
 * @returns {void}
 */
export declare function setWindInDelayMax(max: number, layer: number): void;
/**
 * Set the minimum duration of the wind when it's going out.
 *
 * @param {number} min - The minimum duration of the wind when it's going out.
 * @param {number} layer - The layer to set the wind out duration min for
 * @returns {void}
 */
export declare function setWindOutDurationMin(min: number, layer: number): void;
/**
 * Set the maximum duration of the wind when it's going out.
 *
 * @param {number} max - The maximum duration of the wind when it's going out.
 * @param {number} layer - The layer to set the wind out duration max for
 * @returns {void}
 */
export declare function setWindOutDurationMax(max: number, layer: number): void;
/**
 * Set the minimum delay of the wind when it's going out.
 *
 * @param {number} min - The minimum delay of the wind when it's going out.
 * @param {number} layer - The layer to set the wind out delay min for
 * @returns {void}
 */
export declare function setWindOutDelayMin(min: number, layer: number): void;
/**
 * Set the maximum delay of the wind when it's going out.
 *
 * @param {number} max - The maximum delay of the wind when it's going out.
 * @param {number} layer - The layer to set the wind out delay max for
 * @returns {void}
 */
export declare function setWindOutDelayMax(max: number, layer: number): void;
/**
 * Set the chance of the wind changing direction after a gust.
 *
 * @param {number} chance - The chance of the wind changing direction after a gust.
 * @param {number} layer - The layer to set the wind out change chance for
 * @returns {void}
 */
export declare function setWindOutChangeChance(chance: number, layer: number): void;
export type { UserConfig, UserSchedule } from './types';
export { diff } from './config';
export * from './defaults';
