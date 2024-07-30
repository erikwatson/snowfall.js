/**
 * @module snowfall
 */

import { UserConfig, UserSchedule, Simulation } from './types'
import * as Sim from './simulation'
import { withinSchedule } from './utils'

let simulation: Simulation

/**
 * Starts the Snowfall simulation.
 *
 * @param {UserConfig} [config] - A config, possibly from the [Visual Config Editor](https://erikwatson.github.io/snowfall-editor/).
 */
export function start(config: UserConfig = {}) {
  simulation = Sim.create()

  try {
    simulation.start(config)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Starts the Snowfall simulation when today's date falls within the date range in the schedule.
 *
 * @param {UserSchedule} userSchedule - A schedule config, defining when the simulation should run from, and when the simulation should run to.
 * @param {UserConfig} [config] - A config, possibly from the [Visual Config Editor](https://erikwatson.github.io/snowfall-editor/).
 */
export function schedule(userSchedule: UserSchedule, config: UserConfig = {}) {
  if (withinSchedule(userSchedule)) {
    start(config)
  }
}

/**
 * Set the background colour
 *
 * @param {string} colour - The background colour of the Canvas
 */
export function setBackground(colour: string) {
  simulation.setBackground(colour)
}

/**
 * Sets the colour of the Snowflakes in the foreground
 *
 * @param {string} colour - A Hex string representing the colour of the foreground snow.
 */
export function setPrimary(colour: string) {
  simulation.setPrimary(colour)
}

/**
 * Sets the colour of the Snowflakes in the background
 *
 * @param {string} colour - A Hex string representing the colour of the background snow.
 */
export function setSecondary(colour: string) {
  simulation.setSecondary(colour)
}

/**
 * Set the density of the Snowflakes. This is the number of snowflakes on screen
 * at a resolution of 1280 x 1080, but this number is scaled up and down at
 * higher and lower resolutions respectively to give a consistent look when
 * resizing.
 *
 * Setting this restarts the simulation.
 *
 * @param {number} density - A number representing the density of snowflakes.
 */
export function setDensity(density: number) {
  simulation.setDensity(density)
}

/**
 * Should the snowflakes grow in size from nothing until they reach their full
 * size? It happens pretty quickly.
 *
 * @param {boolean} value - Yes or no?
 */
export function setRespectOrientation(value: boolean) {
  simulation.setRespectOrientation(value)
}

/**
 * Should the snowflakes grow in size from nothing until they reach their full
 * size? It happens pretty quickly.
 *
 * Setting this restarts the simulation.
 *
 * @param {boolean} value - Yes or no?
 */
export function setFade(value: boolean) {
  simulation.setFade(value)
}

/**
 * Set the Amplitude of the Wave motion of the Snowflakes
 *
 * @param {number} amplitude - The Amplitude to set
 */
export function setAmplitude(amplitude: number) {
  simulation.setAmplitude(amplitude)
}

/**
 * Set the Frequency of the Wave motion of the Snowflakes.
 *
 * @param {number} frequency - The frequency to set
 */
export function setFrequency(frequency: number) {
  simulation.setFrequency(frequency)
}

/**
 * Set this to true to prevent the update.
 * Set it to true to continue from where we left off.
 *
 * @param {boolean} pause - If the simulation should be halted or not
 */
export function setPaused(pause: boolean) {
  simulation.setPaused(pause)
}

/**
 * Pause/unpause the snowfall update loop
 */
export function togglePaused() {
  simulation.togglePaused()
}

/**
 * Set the angle and strength of the wind in the simulation.
 *
 * @param {number} angle - The angle of the wind, in degrees
 * @param {number} strength - The strength of the wind
 */
export function setWind(angle: number, strength: number) {
  simulation.setWind(angle, strength)
}

/**
 * Set the angle of the wind in the simulation.
 *
 * @param {number} angle - The angle of the wind, in degrees
 */
export function setWindAngle(angle: number) {
  simulation.setWindAngle(angle)
}

/**
 * Set the strength of the wind in the simulation.
 *
 * @param {number} strength - The strength of the wind
 */
export function setWindStrength(strength: number) {
  simulation.setWindStrength(strength)
}

/**
 * Set the wind gusts in the simulation.
 * This restarts the simulation.
 *
 * @param {boolean} gusts - Should there be gusts in the wind?
 */
export function setGusts(gusts: boolean) {
  simulation.setGusts(gusts)
}

/**
 * Set the angle and strength of gravity in the simulation.
 *
 * @param {number} angle - The angle of gravity, in degrees
 * @param {number} strength - The strength of the gravity
 */
export function setGravity(angle: number, strength: number) {
  simulation.setGravity(angle, strength)
}

/**
 * Set the angle of gravity in the simulation.
 *
 * @param {number} angle - The angle of gravity, in degrees
 */
export function setGravityAngle(angle: number) {
  simulation.setGravityAngle(angle)
}

/**
 * Set the strength of gravity in the simulation.
 *
 * @param {number} strength - The strength of the gravity
 */
export function setGravityStrength(strength: number) {
  simulation.setGravityStrength(strength)
}

/*
setInAdditionalStrengthMin,
    setInAdditionalStrengthMax,
    setInDurationMin,
    setInDurationMax,
    setInDelayMin,
    setInDelayMax,
    setOutDurationMin,
    setOutDurationMax,
    setOutDelayMin,
    setOutDelayMax,
    setOutChangeChance
    */

/**
 * Set the minimum additional strength of the wind when it's coming in.
 *
 * @param {number} min - The minimum additional strength of the wind when it's coming in.
 * @returns {void}
 */
export function setWindInAdditionalStrengthMin(min: number) {
  simulation.setWindInAdditionalStrengthMin(min)
}

/**
 * Set the maximum additional strength of the wind when it's coming in.
 *
 * @param {number} max - The maximum additional strength of the wind when it's coming in.
 * @returns {void}
 */
export function setWindInAdditionalStrengthMax(max: number) {
  simulation.setWindInAdditionalStrengthMax(max)
}

/**
 * Set the minimum duration of the wind when it's coming in.
 *
 * @param {number} min - The minimum duration of the wind when it's coming in.
 * @returns {void}
 */
export function setWindInDurationMin(min: number) {
  simulation.setWindInDurationMin(min)
}

/**
 * Set the maximum duration of the wind when it's coming in.
 *
 * @param {number} max - The maximum duration of the wind when it's coming in.
 * @returns {void}
 */
export function setWindInDurationMax(max: number) {
  simulation.setWindInDurationMax(max)
}

/**
 * Set the minimum delay of the wind when it's coming in.
 *
 * @param {number} min - The minimum delay of the wind when it's coming in.
 * @returns {void}
 */
export function setWindInDelayMin(min: number) {
  simulation.setWindInDelayMin(min)
}

/**
 * Set the maximum delay of the wind when it's coming in.
 *
 * @param {number} max - The maximum delay of the wind when it's coming in.
 * @returns {void}
 */
export function setWindInDelayMax(max: number) {
  simulation.setWindInDelayMax(max)
}

/**
 * Set the minimum duration of the wind when it's going out.
 *
 * @param {number} min - The minimum duration of the wind when it's going out.
 * @returns {void}
 */
export function setWindOutDurationMin(min: number) {
  simulation.setWindOutDurationMin(min)
}

/**
 * Set the maximum duration of the wind when it's going out.
 *
 * @param {number} max - The maximum duration of the wind when it's going out.
 * @returns {void}
 */
export function setWindOutDurationMax(max: number) {
  simulation.setWindOutDurationMax(max)
}

/**
 * Set the minimum delay of the wind when it's going out.
 *
 * @param {number} min - The minimum delay of the wind when it's going out.
 * @returns {void}
 */
export function setWindOutDelayMin(min: number) {
  simulation.setWindOutDelayMin(min)
}

/**
 * Set the maximum delay of the wind when it's going out.
 *
 * @param {number} max - The maximum delay of the wind when it's going out.
 * @returns {void}
 */
export function setWindOutDelayMax(max: number) {
  simulation.setWindOutDelayMax(max)
}

/**
 * Set the chance of the wind changing direction after a gust.
 *
 * @param {number} chance - The chance of the wind changing direction after a gust.
 * @returns {void}
 */
export function setWindOutChangeChance(chance: number) {
  simulation.setWindOutChangeChance(chance)
}

// Exporting types for TypeDoc
export type { UserConfig, UserSchedule } from './types'

// export everything as default
// export default {
//   start,
//   schedule,
//   setBackground,
//   setPrimary,
//   setSecondary,
//   setDensity,
//   setRespectOrientation,
//   setFade,
//   setAmplitude,
//   setFrequency,
//   setPaused,
//   togglePaused,
//   setWind,
//   setWindAngle,
//   setWindStrength,
//   setGusts,
//   setGravity,
//   setGravityAngle,
//   setGravityStrength,
//   setWindInAdditionalStrengthMin,
//   setWindInAdditionalStrengthMax,
//   setWindInDurationMin,
//   setWindInDurationMax,
//   setWindInDelayMin,
//   setWindInDelayMax,
//   setWindOutDurationMin,
//   setWindOutDurationMax,
//   setWindOutDelayMin,
//   setWindOutDelayMax,
//   setWindOutChangeChance
// }
