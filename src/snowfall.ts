/**
 * @module snowfall
 */

import { UserConfig } from './types'
import * as Simulation from './simulation'

/**
 * Starts the Snowfall simulation.
 *
 * @param {UserConfig} [config] - A config, possibly from the Visual Config Editor.
 * @param {string} [config.attachTo] - A string that represents the ID of an element you want to attach snowfall to. If blank, this defaults to #snowfall.
 * @param {string} [config.bg = '#0d0014'] - A hex string representing the Background Colour of the canvas.
 * @param {string} [config.primary = '#8d90b7'] - A hex string representing the colour of the snowflakes in the foreground.
 * @param {string} [config.secondary = '#ffffff'] - A hex string representing the colour of the snowflakes in the background.
 * @param {number} [config.density = 200] - A number representing the required density of snowflakes on screen. Note, this is not the actual number of snowflakes.
 * @param {boolean} [config.fadeIn = false] - Should the snowflakes grow in size when the app starts or should they begin at their full size?
 * @param {boolean} [config.scroll = false] - Should the snowflakes scroll when the user scrolls up and down the page?
 * @param {Wave} [config.wave] - Configure the wave motion of the snowflakes.
 * @param {number} [config.wave.frequency = 0.02] - The frequency of the wave the snowflakes follow.
 * @param {number} [config.wave.amplitude = 1.0] - The amplitude of the wave the snowflakes follow.
 * @param {Gravity} [config.gravity] - Configure the gravity of the simulation.
 * @param {number} [config.gravity.angle = 90] - The angle of gravity, in degrees.
 * @param {number} [config.gravity.strength = 0.7] - The strength of gravity.
 * @param {Wind} [config.wind] - Configure the wind.
 * @param {number} [config.wind.angle = 0] - The angle of the wind, in degrees.
 * @param {number} [config.wind.strength = 0] - The strength of the wind.
 */
function start(config: UserConfig = {}) {
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
function setBackground(col: string) {
  Simulation.setBackground(col)
}

/**
 * Sets the colour of the Snowflakes in the foreground
 *
 * @param {string} colour - A Hex string representing the colour of the foreground snow.
 */
function setPrimary(col: string) {
  Simulation.setPrimary(col)
}

/**
 * Sets the colour of the Snowflakes in the background
 *
 * @param {string} colour - A Hex string representing the colour of the background snow.
 */
function setSecondary(col: string) {
  Simulation.setSecondary(col)
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
function setDensity(den: number) {
  Simulation.setDensity(den)
}

/**
 * Should the snowflakes grow in size from nothing until they reach their full
 * size? It happens pretty quickly.
 *
 * Setting this restarts the simulation.
 *
 * @param {Boolean} value - Yes or no?
 */
function setFade(val: boolean) {
  Simulation.setFade(val)
}

/**
 * Should the snowflakes scroll up and down the page as the User scrolls?
 * @param {Boolean} value - Yes or no?
 */
function setScroll(val: boolean) {
  Simulation.setScroll(val)
}

/**
 * Set the Amplitude of the Wave motion of the Snowflakes
 *
 * @param {number} amplitude - The Amplitude to set
 */
function setAmplitude(num: number) {
  Simulation.setAmplitude(num)
}

/**
 * Set the Frequency of the Wave motion of the Snowflakes.
 *
 * @param {number} frequency - The frequency to set
 */
function setFrequency(freq: number) {
  Simulation.setFrequency(freq)
}

/**
 * Set this to true to prevent the update.
 * Set it to true to continue from where we left off.
 *
 * @param {boolean} pause - If the simulation should be halted or not
 */
function setPaused(pause: boolean) {
  Simulation.setPaused(pause)
}

/**
 * Pause/unpause the snowfall update loop
 */
function togglePaused() {
  Simulation.togglePaused()
}

/**
 * Set the angle and strength of the wind in the simulation.
 *
 * @param {number} angle - The angle of the wind, in degrees
 * @param {number} strength - The strength of the wind
 */
export function setWind(degrees: number, strength: number) {
  Simulation.setWind(degrees, strength)
}

/**
 * Set the angle and strength of gravity in the simulation.
 *
 * @param {number} angle - The angle of gravity, in degrees
 * @param {number} strength - The strength of the gravity
 */
export function setGravity(degrees: number, strength: number) {
  Simulation.setGravity(degrees, strength)
}

;(window as any).snowfall = {
  setAmplitude,
  setBackground,
  setDensity,
  setFade,
  setFrequency,
  setGravity,
  setPaused,
  setPrimary,
  setScroll,
  setSecondary,
  setWind,
  start,
  togglePaused
}

start()
