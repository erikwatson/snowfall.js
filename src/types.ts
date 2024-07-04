import { Vec2 } from '@erikwatson/bramble'

export type Snowflake = {
  pos: Vec2
  size: number
  renderedSize: number
  noise: number
  amplitude: number
  frequency: number
  random: number
}

export type Config = {
  attachTo: HTMLElement | null
  background: string
  primary: string
  secondary: string
  density: number
  fadeIn: boolean
  scroll: boolean
  wave: {
    frequency: number
    amplitude: number
  }
  gravity: {
    angle: number
    strength: number
  }
  wind: {
    angle: number
    strength: number
  }
}

export type UserConfig = Partial<Config>
