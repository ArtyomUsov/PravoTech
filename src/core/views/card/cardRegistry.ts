import React from "react";
import { CardType } from "../../models/ActionCard";
import { CardProps } from "./CardProps";
import { ApprovalCard } from "./ApprovalCard";
import { DeadlineCard } from "./DeadlineCard";
import { PaymentCard } from "./PaymentCard";
import { NotificationCard } from "./NotificationCard";
import { ReviewCard } from "./ReviewCard";

/**
 * Component-strategy: каждый тип карточки — свой компонент.
 * Добавление нового типа = новый компонент + запись в маппинг.
 * Никаких if/else или switch.
 */
export const cardComponents: Record<CardType, React.ComponentType<CardProps>> = {
  [CardType.Approval]: ApprovalCard,
  [CardType.Deadline]: DeadlineCard,
  [CardType.Payment]: PaymentCard,
  [CardType.Notification]: NotificationCard,
  [CardType.Review]: ReviewCard,
};