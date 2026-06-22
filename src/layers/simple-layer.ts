import { Graphics } from '@erikwatson/bramble'
import { ISimpleLayer, SimpleLayerConfig } from '../types'
import { BaseLayer } from './base-layer'

export class SimpleLayer
  extends BaseLayer<SimpleLayerConfig>
  implements ISimpleLayer
{
  mode: 'simple' = 'simple'

  setColour(colour: string): void {
    throw new Error('Method not implemented.')
  }

  render(gfx: Graphics): void {
    this.snowflakes.forEach(flake => {
      gfx.transparency(() => {
        if (this.config.trail) {
          if (
            flake.previousPosition.x >= 0 &&
            flake.previousPosition.x <= this.width &&
            flake.previousPosition.y >= 0 &&
            flake.previousPosition.y <= this.height &&
            flake.position.x >= 0 &&
            flake.position.x <= this.width &&
            flake.position.y >= 0 &&
            flake.position.y <= this.height
          ) {
            gfx.line(flake.position, flake.previousPosition, {
              colour: this.config.colour,
              opacity: flake.opacity,
              width: flake.renderedSize * 2
            })
          }
        } else {
          gfx.circle(flake.position, flake.renderedSize, {
            fill: {
              colour: this.config.colour
            },
            line: {
              width: 0
            }
          })
        }
      }, flake.opacity)
    })
  }
}
