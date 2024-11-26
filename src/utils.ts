import { vec2 } from '@erikwatson/bramble'
import { random } from './math'
import { ConfigLayer, UserSchedule } from './types'

export function getElementOrThrow(id: string): HTMLElement {
  const result = document.getElementById(id)

  if (!result) {
    throw new Error(`Error: Element #${id} not found.`)
  }

  return result
}

export function withinSchedule(schedule: UserSchedule) {
  const today = new Date()
  const currentYear = today.getFullYear()

  // Create Date objects for the start and end of the schedule within the current year
  const from = new Date(currentYear, schedule.from.month - 1, schedule.from.day)
  const to = new Date(currentYear, schedule.to.month - 1, schedule.to.day)

  // Adjust the 'to' date for schedules that span the new year
  if (to < from) {
    to.setFullYear(to.getFullYear() + 1)
  }

  // Check if today is within the schedule
  const shouldStart = today >= from && today <= to
  return shouldStart
}

// This function figures out how many snowflakes we should use for our given
// canvas size.
//
// Just setting a fixed number of snowflakes would give an uneven distribution
// of snowflakes across different screen sizes, for example.
export function requiredSnowflakes(
  width: number,
  height: number,
  density: number
) {
  const tenEightyPee = 1920 * 1080
  const thisScreen = width * height
  const snowflakeCount = Math.round(density * (thisScreen / tenEightyPee))

  return snowflakeCount
}

export function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function makeSnowflakes(
  num: number,
  config: ConfigLayer,
  width: number,
  height: number
) {
  const result = Array.from({ length: num }, () => {
    const size = 3 + random() * 5
    const renderedSize = config.fadeIn === true ? 0 : size

    const posX = random(width)
    const posY = random(height)
    const position = vec2.create(posX, posY)

    return {
      position,
      size,
      renderedSize,
      noise: random(10), // Random value, just to add some uncertainty
      amplitude: random(config.wave.amplitude),
      frequency: random(config.wave.frequency),
      random: random(),
      time: 0,
      colour: 'white'
    }
  })

  return result
}
