export interface AuditEntry {
  id: string;
  entityType: "card" | "document" | "calendar";
  entityId: string;
  action:
    | "card:resolved"
    | "card:created"
    | "document:created"
    | "document:viewed"
    | "agent:note";
  actor: "agent" | "user";
  actorName?: string;
  summary: string;
  workspaceId?: string;
  threadId?: string;
  relatedIds?: {
    cardId?: string;
    documentId?: string;
    eventId?: string;
  };
  timestamp: string;
}
