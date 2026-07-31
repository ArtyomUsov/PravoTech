import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import {
  ActionCard,
  CardType,
  CardStatus,
  CardAction,
} from "../../models/ActionCard";
import { PriorityBadge } from "./PriorityBadge";
import { SourceLink } from "../chat/SourceLink";

const cardConfig: Record<CardType, { icon: string; actions: CardAction[] }> = {
  [CardType.Approval]: {
    icon: "✅",
    actions: [
      { label: "Подтвердить", value: "approve", primary: true },
      { label: "Изменить", value: "modify", primary: false },
      { label: "Отклонить", value: "reject", primary: false },
    ],
  },
  [CardType.Deadline]: {
    icon: "⏰",
    actions: [
      { label: "Создать задачу", value: "approve", primary: true },
      { label: "Изменить дату", value: "modify", primary: false },
      { label: "Отклонить", value: "reject", primary: false },
    ],
  },
  [CardType.Payment]: {
    icon: "💰",
    actions: [
      { label: "К оплате", value: "approve", primary: true },
      { label: "Изменить", value: "modify", primary: false },
      { label: "Отклонить", value: "reject", primary: false },
    ],
  },
  [CardType.Notification]: {
    icon: "📨",
    actions: [
      { label: "Отправлено", value: "approve", primary: true },
      { label: "Изменить", value: "modify", primary: false },
      { label: "Отклонить", value: "reject", primary: false },
    ],
  },
  [CardType.Review]: {
    icon: "🔍",
    actions: [
      { label: "Принять к сведению", value: "acknowledge", primary: true },
      { label: "Создать задачу", value: "approve", primary: false },
      { label: "Отклонить", value: "reject", primary: false },
    ],
  },
};

export const ActionCardView = observer(
  ({
    card,
    expanded,
    isResolving,
    onToggle,
    onResolve,
    onOpenDocument,
  }: {
    card: ActionCard;
    expanded: boolean;
    isResolving: boolean;
    onToggle: () => void;
    onResolve: (
      decision: "approved" | "modified" | "rejected" | "acknowledged"
    ) => void;
    onOpenDocument?: (docId: string) => void;
  }) => {
    const config = cardConfig[card.type];

    const handleResolve = (value: string) => {
      const mapping: Record<
        string,
        "approved" | "modified" | "rejected" | "acknowledged"
      > = {
        approve: "approved",
        modify: "modified",
        reject: "rejected",
        acknowledge: "acknowledged",
      };
      onResolve(mapping[value] || "approved");
    };

    const handleClick = () => {
      if (!isResolving) {
        onToggle();
      }
    };

    return (
      <Card
        sx={{
          mb: 1.5,
          cursor: "pointer",
          transition: "all 0.2s",
          borderLeft: "4px solid",
          borderColor:
            card.priority === "P0"
              ? "#d32f2f"
              : card.priority === "P1"
              ? "#f57c00"
              : card.priority === "P2"
              ? "#1976d2"
              : "#757575",
          opacity: card.status === CardStatus.Resolved ? 0.5 : 1,
          "&:hover": { boxShadow: 3 },
          // Анимация появления карточки
          animation: "cardEnter 0.4s ease-out",
          "@keyframes cardEnter": {
            "0%": {
              opacity: 0,
              transform: "translateY(12px) scale(0.98)",
            },
            "100%": {
              opacity: card.status === CardStatus.Resolved ? 0.5 : 1,
              transform: "translateY(0) scale(1)",
            },
          },
        }}
        onClick={handleClick}
      >
        <CardContent sx={{ pb: 1, pt: 1.5, px: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Box sx={{ fontSize: 18 }}>{config.icon}</Box>
            <PriorityBadge priority={card.priority} />
            {isResolving && (
              <Box sx={{ fontSize: 12, color: "#00897b", ml: "auto" }}>
                Обработка...
              </Box>
            )}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {card.title}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            {card.description}
          </Typography>
        </CardContent>

        {/* Всегда раскрытая секция с деталями */}
        <Box sx={{ px: 1.5, pb: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
            <strong>Агент:</strong> {card.agentNote}
          </Typography>

          {card.sourceRefs.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.25 }}
              >
                <strong>Источники:</strong>
              </Typography>
              {card.sourceRefs.map((ref, i) => (
                <SourceLink
                  key={i}
                  sourceRef={ref}
                  onOpenDocument={onOpenDocument}
                />
              ))}
            </Box>
          )}

          <CardActions sx={{ px: 0, gap: 0.5, flexWrap: "wrap" }}>
            {config.actions.map((action) => (
              <Button
                key={action.value}
                size="small"
                variant={action.primary ? "contained" : "outlined"}
                color={action.primary ? "primary" : "inherit"}
                disabled={isResolving}
                onClick={(e) => {
                  e.stopPropagation();
                  handleResolve(action.value);
                }}
                sx={{ fontSize: 12, py: 0.25 }}
              >
                {action.label}
              </Button>
            ))}
          </CardActions>
        </Box>
      </Card>
    );
  }
);
