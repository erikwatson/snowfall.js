// import {
//   setAmplitude,
//   setBackground,
//   setDensity,
//   setFade,
//   setFrequency,
//   setGravity,
//   setGravityAngle,
//   setGravityStrength,
//   setPaused,
//   setPrimary,
//   setSecondary,
//   setWind,
//   setWindAngle,
//   setWindStrength,
//   start,
//   togglePaused
// } from './snowfall'
import * as snowfall from './snowfall'

// Add snowfall to the window object so we can actually use it
;(window as any).snowfall = snowfall
