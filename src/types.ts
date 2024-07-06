import { Vec2 } from '@erikwatson/bramble'

export type Config = {
  attachTo: HTMLElement
  background: string
  primary: string
  secondary: string
  density: number
  fadeIn: boolean
  scroll: boolean
  wave: Wave
  gravity: Gravity
  wind: Wind
}

export type UserConfig = Partial<Config> & {
  attachTo?: string
}

export type Wave = {
  frequency: number
  amplitude: number
}

export type Gravity = {
  angle: number
  strength: number
}

export type Wind = {
  angle: number
  strength: number
}

export type Snowflake = {
  pos: Vec2
  size: number
  renderedSize: number
  noise: number
  amplitude: number
  frequency: number
  random: number
}
