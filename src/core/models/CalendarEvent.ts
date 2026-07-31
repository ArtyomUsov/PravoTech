export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "deadline" | "hearing" | "meeting" | "reminder";
  workspaceId: string;
  threadId?: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  relatedCardId?: string;
  relatedDocumentId?: string;
}
