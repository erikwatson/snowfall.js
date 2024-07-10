import { Vec2 } from '@erikwatson/bramble'

export type Config = {
  attachTo: HTMLElement
  /**
   * A hex string representing the Background Colour of the canvas.
   * @default '#0d0014'
   */
  background: string

  /**
   * A hex string representing the colour of the snowflakes in the foreground.
   * @default '#8d90b7'
   */
  primary: string

  /**
   * A hex string representing the colour of the snowflakes in the background.
   * @default '#ffffff'
   */
  secondary: string

  /**
   * A number representing the required density of snowflakes on screen. Note, this is not the actual number of snowflakes.
   * @default 200
   */
  density: number

  /**
   * Should the snowflakes grow in size when the app starts or should they begin at their full size?
   * @default false
   */
  fadeIn: boolean

  wave: {
    /**
     * The frequency of the wave the snowflakes follow.
     * @default 0.02
     */
    frequency: number

    /**
     * The amplitude of the wave the snowflakes follow.
     * @default 1.0
     */
    amplitude: number
  }

  gravity: {
    /**
     * The angle of gravity, in degrees.
     * @default 90
     */
    angle: number

    /**
     * The strength of gravity.
     * @default 0.7
     */
    strength: number

    /**
     * Should gravity respect device orientation?
     * This takes precedence over the angle settings.
     * @default false
     */
    respectOrientation: boolean
  }

  wind: {
    /**
     * The angle of the wind, in degrees.
     * @default 0
     */
    angle: number

    /**
     * The strength of the wind.
     * @default 0
     */
    strength: number
  }
}

export interface UserConfig extends Partial<Omit<Config, 'attachTo'>> {
  /**
   * A string that represents the ID of an element you want to attach snowfall to.
   * @default '#snowfall'
   */
  attachTo?: string
}

export interface UserSchedule {
  /** The date from which to start the simulation */
  from: {
    /** The day of the month, starting at 1 */
    day: number

    /** The month of the year, starting at 1 */
    month: number
  }

  /** The date on which to end the simulation */
  to: {
    /** The day of the month, starting at 1 */
    day: number

    /** The month of the year, starting at 1 */
    month: number
  }
}

export type Snowflake = {
  position: Vec2
  size: number
  renderedSize: number
  noise: number
  amplitude: number
  frequency: number
  random: number
}

export type Simulation = {
  start: (config: UserConfig) => void
  setAmplitude: (num: number) => void
  setBackground: (col: string) => void
  setDensity: (den: number) => void
  setFade: (val: boolean) => void
  setFrequency: (freq: number) => void
  setGravity: (degrees: number, strength: number) => void
  setGravityAngle: (degrees: number) => void
  setGravityStrength: (strength: number) => void
  setPaused: (pause: boolean) => void
  setPrimary: (col: string) => void
  setSecondary: (col: string) => void
  setWind: (degrees: number, strength: number) => void
  setWindAngle: (degrees: number) => void
  setWindStrength: (strength: number) => void
  togglePaused: () => void
}
