/**
 * @module snowfall
 *
 * Lightweight, high-performance snowfall effect for the web.
 * Fully configurable, supports multiple layers, wind, gusts, and scheduled activation.
 *
 * Stay cool ☃️
 */
import { UserConfig, UserSchedule } from './types';
/**
 * Starts the Snowfall simulation.
 *
 * @param {UserConfig} [config] - A config, possibly from the [Visual Config Editor](https://erikwatson.github.io/snowfall-editor/).
 */
export declare function start(config?: UserConfig): void;
export declare function restart(config?: UserConfig): void;
export declare function stop(): void;
/**
 * Starts the Snowfall simulation when today's date falls within the date range in the schedule.
 *
 * @param {UserSchedule} userSchedule - A schedule config, defining when the simulation should run from, and when the simulation should run to.
 * @param {UserConfig} [config] - A config, possibly from the [Visual Config Editor](https://erikwatson.github.io/snowfall-editor/).
 */
export declare function schedule(userSchedule: UserSchedule, config?: UserConfig): void;
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
 * Set the Amplitude of the sway of the Snowflakes
 *
 * @param {number} amplitude - The Amplitude to set
 * @param {number} layer - The layer to set the amplitude for
 */
export declare function setAmplitude(amplitude: number, layer: number): void;
/**
 * Set the Frequency of the sway of the Snowflakes.
 *
 * @param {number} frequency - The frequency to set
 * @param {number} layer - The layer to set the frequency for
 */
export declare function setFrequency(frequency: number, layer: number): void;
/**
 * Pauses or resumes a specific layer.
 *
 * @param {boolean} pause - Pass true to pause the layer, false to resume
 * @param {number} layer - The layer index
 */
export declare function setPaused(pause: boolean, layer: number): void;
/**
 * Pause/unpause the snowfall update loop for a specific layer.
 *
 * @param layer - The layer index to toggle
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
 * @param {number} layer    - The layer to apply the wind strength to
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
/**
 * Set the minimum mass of the snowflakes.
 *
 * @param {number} min - The minimum mass of the snowflakes.
 * @param {number} layer - The layer to set the mass min for
 */
export declare function setMassMin(min: number, layer: number): void;
/**
 * Set the maximum mass of the snowflakes.
 *
 * @param {number} max - The maximum mass of the snowflakes.
 * @param {number} layer - The layer to set the mass max for
 */
export declare function setMassMax(max: number, layer: number): void;
/**
 * Set the minimum size of the snowflakes.
 *
 * @param {number} min - The minimum rendered size of the snowflakes.
 * @param {number} layer - The layer to set the rendered size min for
 */
export declare function setSizeMin(min: number, layer: number): void;
/**
 * Set the maximum size of the snowflakes.
 *
 * @param {number} max - The maximum rendered size of the snowflakes.
 * @param {number} layer - The layer to set the rendered size max for
 */
export declare function setSizeMax(max: number, layer: number): void;
export { diff } from './config';
export * from './defaults';
export { clone } from './utils';
export { isSimpleLayer } from './utils';
export { UserSchedule, UserConfig, SimpleLayerConfig, ImageLayerConfig, CompleteUserConfig, BaseConfig, ConfigLayer, Gravity, SizeBounds, Sway, Wind, Gusts, In, Out } from './types';
