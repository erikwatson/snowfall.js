import { Graphics, InputState } from '@erikwatson/bramble'
import { IImageLayer, ImageLayerConfig } from '../types'
import { BaseLayer } from './base-layer'
import { addRotation } from '../snowflake'

export class ImageLayer
  extends BaseLayer<ImageLayerConfig>
  implements IImageLayer
{
  mode: 'image' = 'image'
  image: HTMLImageElement = new Image()

  constructor(
    config: ImageLayerConfig,
    width: number,
    height: number,
    strength: number,
    durationIn: number,
    windDelayIn: number,
    durationOut: number,
    windDelayOut: number,
    changeChance: number
  ) {
    super(
      config,
      width,
      height,
      strength,
      durationIn,
      windDelayIn,
      durationOut,
      windDelayOut,
      changeChance
    )
    this.image.src = config.image
  }

  setImage(image: string): void {
    throw new Error('Method not implemented.')
  }

  update(dt: number, input: InputState) {
    super.update(dt, input)
    for (const snowflake of this.snowflakes) {
      addRotation(snowflake, dt)
    }
  }

  render(gfx: Graphics) {
    this.snowflakes.forEach(flake => {
      const size = flake.renderedSize
      const offset = size / 2

      gfx.transparency(() => {
        if (this.config.rotate) {
          gfx.rotation(
            () => {
              gfx.image(
                this.image,
                {
                  x: flake.position.x - offset,
                  y: flake.position.y - offset
                },
                { width: size, height: size }
              )
            },
            flake.rotation,
            flake.position
          )
        } else {
          gfx.image(
            this.image,
            {
              x: flake.position.x - offset,
              y: flake.position.y - offset
            },
            { width: size, height: size }
          )
        }
      }, flake.opacity)
    })
  }
}
