import { UserSchedule } from './types'

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
