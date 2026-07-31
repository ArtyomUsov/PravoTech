import { Priority } from "./Priority";

export enum CardType {
  Approval = "approval",
  Deadline = "deadline",
  Payment = "payment",
  Notification = "notification",
  Review = "review",
}

export enum CardStatus {
  Pending = "pending",
  Resolving = "resolving",
  Resolved = "resolved",
  Rejected = "rejected",
  Dismissed = "dismissed",
}

export interface SourceRef {
  type: "document" | "card";
  targetId: string;
  title: string;
  section?: string;
}

export interface ActionCard {
  id: string;
  type: CardType;
  priority: Priority;
  status: CardStatus;
  workspaceId: string;
  threadId?: string;

  title: string;
  description: string;
  agentNote: string;
  createdAt: string;
  deadline?: string;

  // Типовые поля для разных типов карточек
  context?: Record<string, string>;
  sourceRefs: SourceRef[];

  // Результат действия
  resolution?: {
    decision: "approved" | "modified" | "rejected" | "acknowledged";
    comment?: string;
    timestamp: string;
  };
}

export interface CardAction {
  label: string;
  value: "approve" | "modify" | "reject" | "acknowledge";
  primary: boolean;
}
