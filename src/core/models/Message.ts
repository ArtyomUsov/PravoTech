import { SourceRef, ActionCard } from "./ActionCard";

export enum Role {
  User = "user",
  Agent = "agent",
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  sourceRefs?: SourceRef[];
  isStreaming?: boolean;
  isPartial?: boolean;
  embeddedCards?: ActionCard[];
}
