import { Graphics, game } from '@erikwatson/bramble'

import { Config, Simulation, UserConfig } from './types'
import { merge } from './config'
import * as TWEEN from '@tweenjs/tween.js'
import { seededRandom } from './math'
import { SimpleLayer } from './layers/simple-layer'
import { ImageLayer } from './layers/image-layer'
import { DEFAULT_BASE_CONFIG, DEFAULT_USER_CONFIG } from './defaults'

export function create(): Simulation {
  let config: Config
  let layers: (SimpleLayer | ImageLayer)[] = []

  const simulation = game.create()

  function commonStart(userConfig: UserConfig) {
    config = merge(userConfig)
    if (!config.attachTo) {
      console.error(
        'Unable to start the application, the specified container could not be found.'
      )
      return
    }
    makeLayers()
  }

  function makeLayers() {
    layers = []
    config.layers.forEach(layer => {
      const strength = seededRandom(
        layer.wind.strength + layer.wind.gusts.in.additionalStrength.min,
        layer.wind.strength + layer.wind.gusts.in.additionalStrength.max
      )

      const durationIn = seededRandom(
        layer.wind.gusts.in.delay.min,
        layer.wind.gusts.in.delay.max
      )
      const windDelayIn = seededRandom(
        layer.wind.gusts.in.delay.min,
        layer.wind.gusts.in.delay.max
      )

      const durationOut = seededRandom(
        layer.wind.gusts.out.duration.min,
        layer.wind.gusts.out.duration.max
      )

      const windDelayOut = seededRandom(
        layer.wind.gusts.out.delay.min,
        layer.wind.gusts.out.delay.max
      )

      const changeChance = seededRandom()

      let newLayer
      if (layer.mode === 'simple') {
        newLayer = new SimpleLayer(
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
      } else if (layer.mode === 'image') {
        newLayer = new ImageLayer(
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
      }

      if (newLayer) {
        layers.push(newLayer)
        newLayer.start()
      }
    })
  }

  function start(userConfig: UserConfig = {}) {
    commonStart(userConfig)

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
    gfx.clear()
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

    restart()
  }

  function restart(newConfig?: Config) {
    simulation.setSize(
      config.attachTo.offsetWidth,
      config.attachTo.offsetHeight
    )

    if (newConfig) {
      makeLayers()
    } else {
      layers.forEach(layer => layer.restart())
    }
  }

  function setColour(col: string, layer: number) {
    if (layers[layer].mode === 'simple') {
      layers[layer].setColour(col)
    } else {
      console.error(
        'attempting to set a colour on a layer that does not have a colour property'
      )
    }
  }

  function setDensity(den: number, layer: number) {
    layers[layer]?.setDensity(den)
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

  function setMassMin(min: number, layer: number) {
    layers[layer]?.setMassMin(min)
  }

  function setMassMax(max: number, layer: number) {
    layers[layer]?.setMassMax(max)
  }

  function setSizeMin(min: number, layer: number) {
    layers[layer]?.setSizeMin(min)
  }

  function setSizeMax(max: number, layer: number) {
    layers[layer]?.setSizeMax(max)
  }

  return {
    start,
    setAmplitude,
    setDensity,
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
    setColour,
    setMassMin,
    setMassMax,
    setSizeMin,
    setSizeMax,
    restart: (userConfig?: UserConfig) => {
      const config = userConfig ? merge(userConfig) : userConfig
      restart(config)
    },
    stop: () => {
      config = merge(DEFAULT_USER_CONFIG) // prbably best to wipe the user settings here
      layers = []
      // simulation.stop()
      simulation.canvas.remove()
    }
  }
}
