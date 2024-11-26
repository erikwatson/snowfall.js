import { Graphics, game } from '@erikwatson/bramble'

import { Config, Simulation, UserConfig } from './types'
import { merge } from './config'
import * as TWEEN from '@tweenjs/tween.js'
import { Layer } from './layer'
import { seededRandom } from './math'

export function create(): Simulation {
  let config: Config
  let layers: Layer[] = []

  const simulation = game.create()

  function start(userConfig: UserConfig = {}) {
    config = merge(userConfig)

    config.layers.forEach(layer => {
      const strength = seededRandom(
        layer.wind.strength + layer.wind.in.additionalStrength.min,
        layer.wind.strength + layer.wind.in.additionalStrength.max
      )

      const durationIn = seededRandom(
        layer.wind.in.delay.min,
        layer.wind.in.delay.max
      )
      const windDelayIn = seededRandom(
        layer.wind.in.delay.min,
        layer.wind.in.delay.max
      )

      const durationOut = seededRandom(
        layer.wind.out.duration.min,
        layer.wind.out.duration.max
      )

      const windDelayOut = seededRandom(
        layer.wind.out.delay.min,
        layer.wind.out.delay.max
      )

      const changeChance = seededRandom()

      const newLayer = new Layer(
        layer,
        config.attachTo.offsetWidth,
        config.attachTo.offsetHeight,
        strength,
        durationIn,
        windDelayIn,
        durationOut,
        windDelayOut,
        changeChance
      )

      layers.push(newLayer)
      newLayer.start()
    })

    if (!config.attachTo) {
      console.error(
        'Unable to start the application, the specified container could not be found.'
      )
      return
    }

    window.onresize = onResize

    simulation.attachTo(config.attachTo)
    simulation.setSize(
      config.attachTo.offsetWidth,
      config.attachTo.offsetHeight
    )
    simulation.setUpdate(dt => update(dt))
    simulation.setRender(gfx => render(gfx))
    simulation.start()
  }

  function update(dt: number) {
    TWEEN.update()
    layers.forEach(layer => {
      layer.update(dt)
    })
  }

  function render(gfx: Graphics) {
    gfx.clear(config.background)
    layers.forEach(layer => {
      layer.render(gfx)
    })
  }

  function onResize() {
    layers.forEach(layer => {
      layer.width = config.attachTo.offsetWidth
      layer.height = config.attachTo.offsetHeight
      layer.restart()
    })
  }

  function restart() {
    layers.forEach(layer => {
      layer.restart()
    })
  }

  function setBackground(col: string) {
    config.background = col
  }

  function setColour(col: string, layer: number) {
    layers[layer]?.setColour(col)
  }

  function setDensity(den: number, layer: number) {
    layers[layer]?.setDensity(den)
  }

  function setRespectOrientation(val: boolean, layer: number) {
    layers[layer]?.setRespectOrientation(val)
  }

  function setFade(val: boolean, layer: number) {
    layers[layer]?.setFade(val)
  }

  function setAmplitude(num: number, layer: number) {
    layers[layer]?.setAmplitude(num)
  }

  function setFrequency(freq: number, layer: number) {
    layers[layer]?.setFrequency(freq)
  }

  function setPaused(pause: boolean, layer: number) {
    layers[layer]?.setPaused(pause)
  }

  function togglePaused(layer: number) {
    layers[layer]?.togglePaused()
  }

  function setWind(degrees: number, strength: number, layer: number) {
    layers[layer]?.setWind(degrees, strength)
  }

  function setWindAngle(degrees: number, layer: number) {
    layers[layer]?.setWindAngle(degrees)
  }

  function setWindStrength(strength: number, layer: number) {
    layers[layer]?.setWindStrength(strength)
  }

  function setGusts(shouldGust: boolean, layer: number) {
    layers[layer]?.setGusts(shouldGust)
  }

  function setGravity(degrees: number, strength: number, layer: number) {
    layers[layer]?.setGravity(degrees, strength)
  }

  function setGravityAngle(degrees: number, layer: number) {
    layers[layer]?.setGravityAngle(degrees)
  }

  function setGravityStrength(strength: number, layer: number) {
    layers[layer]?.setGravityStrength(strength)
  }

  function setWindInAdditionalStrengthMin(min: number, layer: number) {
    layers[layer]?.setWindInAdditionalStrengthMin(min)
  }

  function setWindInAdditionalStrengthMax(max: number, layer: number) {
    layers[layer]?.setWindInAdditionalStrengthMax(max)
  }

  function setWindInDurationMin(min: number, layer: number) {
    layers[layer]?.setWindInDurationMin(min)
  }

  function setWindInDurationMax(max: number, layer: number) {
    layers[layer]?.setWindInDurationMax(max)
  }

  function setWindInDelayMin(min: number, layer: number) {
    layers[layer]?.setWindInDelayMin(min)
  }

  function setWindInDelayMax(max: number, layer: number) {
    layers[layer]?.setWindInDelayMax(max)
  }

  function setWindOutDurationMin(min: number, layer: number) {
    layers[layer]?.setWindOutDurationMin(min)
  }

  function setWindOutDurationMax(max: number, layer: number) {
    layers[layer]?.setWindOutDurationMax(max)
  }

  function setWindOutDelayMin(min: number, layer: number) {
    layers[layer]?.setWindOutDelayMin(min)
  }

  function setWindOutDelayMax(max: number, layer: number) {
    layers[layer]?.setWindOutDelayMax(max)
  }

  function setWindOutChangeChance(chance: number, layer: number) {
    layers[layer]?.setWindOutChangeChance(chance)
  }

  return {
    start,
    setAmplitude,
    setBackground,
    setDensity,
    setRespectOrientation,
    setFade,
    setFrequency,
    setGravity,
    setGravityAngle,
    setGravityStrength,
    setPaused,
    setWind,
    setWindAngle,
    setWindStrength,
    setGusts,
    togglePaused,
    setWindInAdditionalStrengthMin,
    setWindInAdditionalStrengthMax,
    setWindInDurationMin,
    setWindInDurationMax,
    setWindInDelayMin,
    setWindInDelayMax,
    setWindOutDurationMin,
    setWindOutDurationMax,
    setWindOutDelayMin,
    setWindOutDelayMax,
    setWindOutChangeChance,
    setColour
  }
}
