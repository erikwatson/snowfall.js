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

export type Snowflake = {
  position: Vec2
  size: number
  renderedSize: number
  noise: number
  amplitude: number
  frequency: number
  random: number
}
