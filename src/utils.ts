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
