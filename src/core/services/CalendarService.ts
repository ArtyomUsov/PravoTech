import { CalendarEvent } from '../models/CalendarEvent'
import { calendarEvents, contractCalendarEvents, litigationCalendarEvents, simulateDelay } from './mock'

export class CalendarService {
  async getEvents(workspaceId?: string): Promise<CalendarEvent[]> {
    await simulateDelay(200, 400)
    if (!workspaceId) return [...calendarEvents]
    if (workspaceId === 'contracts') return [...contractCalendarEvents]
    if (workspaceId === 'litigation') return [...litigationCalendarEvents]
    return []
  }

  async getAllEvents(): Promise<CalendarEvent[]> {
    await simulateDelay(200, 400)
    return [...calendarEvents]
  }
}