import { ActionCard } from "../../models/ActionCard";

export interface CardProps {
  card: ActionCard;
  isResolving: boolean;
  onResolve: (
    decision: "approved" | "modified" | "rejected" | "acknowledged"
  ) => void;
  onOpenDocument?: (docId: string) => void;
}
