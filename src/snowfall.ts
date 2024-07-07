/**
 * @module snowfall
 */

import { UserConfig } from './types'
import * as Simulation from './simulation'

/**
 * Starts the Snowfall simulation.
 *
 * @param {UserConfig} [config] - A config, possibly from the [Visual Config Editor](https://erikwatson.github.io/snowfall-editor/).
 */
export function start(config: UserConfig = {}) {
  try {
    Simulation.start(config)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Set the background colour
 *
 * @param {string} colour - The background colour of the Canvas
 */
export function setBackground(colour: string) {
  Simulation.setBackground(colour)
}

/**
 * Sets the colour of the Snowflakes in the foreground
 *
 * @param {string} colour - A Hex string representing the colour of the foreground snow.
 */
export function setPrimary(colour: string) {
  Simulation.setPrimary(colour)
}

/**
 * Sets the colour of the Snowflakes in the background
 *
 * @param {string} colour - A Hex string representing the colour of the background snow.
 */
export function setSecondary(colour: string) {
  Simulation.setSecondary(colour)
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
  Simulation.setDensity(density)
}

/**
 * Should the snowflakes grow in size from nothing until they reach their full
 * size? It happens pretty quickly.
 *
 * Setting this restarts the simulation.
 *
 * @param {Boolean} value - Yes or no?
 */
export function setFade(value: boolean) {
  Simulation.setFade(value)
}

/**
 * Set the Amplitude of the Wave motion of the Snowflakes
 *
 * @param {number} amplitude - The Amplitude to set
 */
export function setAmplitude(amplitude: number) {
  Simulation.setAmplitude(amplitude)
}

/**
 * Set the Frequency of the Wave motion of the Snowflakes.
 *
 * @param {number} frequency - The frequency to set
 */
export function setFrequency(frequency: number) {
  Simulation.setFrequency(frequency)
}

/**
 * Set this to true to prevent the update.
 * Set it to true to continue from where we left off.
 *
 * @param {boolean} pause - If the simulation should be halted or not
 */
export function setPaused(pause: boolean) {
  Simulation.setPaused(pause)
}

/**
 * Pause/unpause the snowfall update loop
 */
export function togglePaused() {
  Simulation.togglePaused()
}

/**
 * Set the angle and strength of the wind in the simulation.
 *
 * @param {number} angle    - The angle of the wind, in degrees
 * @param {number} strength - The strength of the wind
 */
export function setWind(angle: number, strength: number) {
  Simulation.setWind(angle, strength)
}

/**
 * Set the angle and strength of gravity in the simulation.
 *
 * @param {number} angle    - The angle of gravity, in degrees
 * @param {number} strength - The strength of the gravity
 */
export function setGravity(angle: number, strength: number) {
  Simulation.setGravity(angle, strength)
}

// Exporting types for TSDoc
export { UserConfig } from './types'
