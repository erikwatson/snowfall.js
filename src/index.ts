import {
  setAmplitude,
  setBackground,
  setDensity,
  setFade,
  setFrequency,
  setGravity,
  setPaused,
  setPrimary,
  setSecondary,
  setWind,
  start,
  togglePaused
} from './snowfall'

// Add snowfall to the window object so we can actually use it
;(window as any).snowfall = {
  setAmplitude,
  setBackground,
  setDensity,
  setFade,
  setFrequency,
  setGravity,
  setPaused,
  setPrimary,
  setSecondary,
  setWind,
  start,
  togglePaused
}
