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
      gfx.circle(flake.position, flake.renderedSize, {
        fill: {
          colour: this.config.colour,
          opacity: flake.opacity
        },
        line: {
          width: 0
        }
      })
    })
  }
}
