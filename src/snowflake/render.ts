import { Graphics } from '@erikwatson/bramble'
import { Snowflake } from '../types'

export function drawLayer(
  gfx: Graphics,
  snowflakes: Snowflake[],
  colour: string
) {
  snowflakes.forEach(snowflake => {
    gfx.circle(snowflake.position, snowflake.renderedSize, {
      fill: { colour },
      line: { width: 0 }
    })
  })
}
