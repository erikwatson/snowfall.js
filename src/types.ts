import { Graphics, Vec2 } from '@erikwatson/bramble'

export type SizeBounds = {
  min: number
  max: number
}

export type In = {
  /**
   * The minimum and maximum strength to add to the wind gusts.
   * @default { min: 1, max: 3 }
   */
  additionalStrength: SizeBounds

  /**
   * The minimum and maximum duration of the wind gusts.
   * @default { min: 1000, max: 3000 }
   */
  duration: SizeBounds

  /**
   * The minimum and maximum delay before the wind eases off.
   * @default { min: 5000, max: 10000 }
   */
  delay: SizeBounds
}

export type Out = {
  /**
   * The minimum and maximum duration of the wind gusts.
   * @default { min: 5000, max: 10000 }
   */
  duration: SizeBounds

  /**
   * The minimum and maximum delay before the wind eases off.
   * @default { min: 1000, max: 10000 }
   */
  delay: SizeBounds
}

export type Gusts = {
  /**
   * Should the wind gust?
   * @default true
   */
  active: boolean
  /**
   * The likelihood of the wind changing direction after a gust. 0.0 is never, 1.0 is always.
   * @default 0.25
   */
  changeChance: number

  in: In
  out: Out
}

export type Gravity = {
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

export type Sway = {
  /**
   * The frequency of the sway the snowflakes follow.
   * @default 0.02
   */
  frequency: number

  /**
   * The amplitude of the sway the snowflakes follow.
   * @default 1.0
   */
  amplitude: number
}

export type Wind = {
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

  gusts: Gusts
}

export interface BaseLayerConfig {
  /**
   * A number representing the required density of snowflakes on screen. Note, this is not the actual number of snowflakes.
   * @default 200
   */
  density: number

  /**
   * The size of the snowflakes.
   * @default { min: 1, max: 3 }
   */
  mass: SizeBounds

  size: SizeBounds

  sway: Sway

  gravity: Gravity

  wind: Wind

  opacity: SizeBounds
}

export interface SimpleLayerConfig extends BaseLayerConfig {
  mode: 'simple'
  /**
   * A hex string representing the colour of the snowflakes in the foreground.
   * @default '#8d90b7'
   */
  colour: string
}

export interface ImageLayerConfig extends BaseLayerConfig {
  mode: 'image'

  /**
   * An image to render
   */
  image: string

  /**
   * Should the snow rotate, or not?
   * @default false
   */
  rotate: boolean
}

export interface BaseConfig {
  [key: string]: any

  /**
   * A hex string representing the Background Colour of the canvas.
   * @default '#0d0014'
   */
  // background: string

  /**
   * An array of uniquely configured snowflake layers.
   */
  layers: ConfigLayer[]
}

export type ConfigLayer = SimpleLayerConfig | ImageLayerConfig

export interface Config extends BaseConfig {
  /**
   * The element to attach the simulation to.
   * @default '#snowfall'
   */
  attachTo: HTMLElement
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface CompleteUserConfig extends BaseConfig {
  /**
   * The element to attach the simulation to, as a string representing the ID.
   */
  attachTo: string

  /**
   * A fully configured array of snowflake layers.
   */
  layers: ConfigLayer[]
}

// UserConfig makes all properties of BaseConfig optional, but `layers` is handled differently
export interface UserConfig
  extends Omit<Partial<CompleteUserConfig>, 'layers'> {
  /**
   * An optional array of uniquely configured snowflake layers,
   * where each layer can be partially configured.
   * @default undefined
   */
  layers?: DeepPartial<ConfigLayer>[]

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
  mass: number
  size: number
  renderedSize: number
  noise: number
  time: number
  amplitude: number
  frequency: number
  random: number
  rotation: number
  opacity: number
}

export interface Simulation {
  start: (config: UserConfig) => void
  setAmplitude: (num: number, layer: number) => void
  setDensity: (den: number, layer: number) => void
  setFrequency: (freq: number, layer: number) => void
  setGravity: (degrees: number, strength: number, layer: number) => void
  setGravityAngle: (degrees: number, layer: number) => void
  setGravityStrength: (strength: number, layer: number) => void
  setPaused: (pause: boolean, layer: number) => void
  setWind: (degrees: number, strength: number, layer: number) => void
  setWindAngle: (degrees: number, layer: number) => void
  setWindStrength: (strength: number, layer: number) => void
  setGusts: (gusts: boolean, layer: number) => void
  togglePaused: (layer: number) => void
  setWindInAdditionalStrengthMin: (min: number, layer: number) => void
  setWindInAdditionalStrengthMax: (max: number, layer: number) => void
  setWindInDurationMin: (min: number, layer: number) => void
  setWindInDurationMax: (max: number, layer: number) => void
  setWindInDelayMin: (min: number, layer: number) => void
  setWindInDelayMax: (max: number, layer: number) => void
  setWindOutDurationMin: (min: number, layer: number) => void
  setWindOutDurationMax: (max: number, layer: number) => void
  setWindOutDelayMin: (min: number, layer: number) => void
  setWindOutDelayMax: (max: number, layer: number) => void
  setWindOutChangeChance: (chance: number, layer: number) => void
  setColour: (colour: string, layer: number) => void
  setMassMin: (min: number, layer: number) => void
  setMassMax: (max: number, layer: number) => void
  setSizeMin: (min: number, layer: number) => void
  setSizeMax: (max: number, layer: number) => void
  restart: (config?: UserConfig) => void
  stop: () => void
}

export interface HasGravity {
  setGravity(degrees: number, strength: number): void
  setGravityAngle(degrees: number): void
  setGravityStrength(strength: number): void
}

export interface HasWind {
  setWind(degrees: number, strength: number): void
  setWindAngle(degrees: number): void
  setWindStrength(strength: number): void
  setGusts(gusts: boolean): void
  setWindInAdditionalStrengthMin(min: number): void
  setWindInAdditionalStrengthMax(max: number): void
  setWindInDurationMin(min: number): void
  setWindInDurationMax(max: number): void
  setWindInDelayMin(min: number): void
  setWindInDelayMax(max: number): void
  setWindOutDurationMin(min: number): void
  setWindOutDurationMax(max: number): void
  setWindOutDelayMin(min: number): void
  setWindOutDelayMax(max: number): void
  setWindOutChangeChance(chance: number): void
}

export interface HasSway {
  setAmplitude(num: number): void
  setFrequency(freq: number): void
}

export interface HasDensity {
  setDensity(density: number): void
}

export interface HasRender {
  render(gfx: Graphics): void
}

export interface IBaseLayer extends HasGravity, HasWind, HasSway {
  start(): void
  pause(): void
  resume(): void
  restart(): void
  update(dt: number): void
  setPaused(pause: boolean): void
  togglePaused(): void
}

export interface ISimpleLayer extends IBaseLayer, HasRender {
  mode: 'simple'
  config: SimpleLayerConfig
  setColour(colour: string): void
}

export interface IImageLayer extends IBaseLayer, HasRender {
  mode: 'image'
  config: ImageLayerConfig
  setImage(image: string): void
}
