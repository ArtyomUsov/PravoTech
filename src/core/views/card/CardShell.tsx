import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { ActionCard, CardStatus } from "../../models/ActionCard";
import { PriorityBadge } from "./PriorityBadge";
import { SourceLink } from "../chat/SourceLink";

/**
 * Shared wrapper for all card types.
 * Renders priority border, header, description, agent note, source links.
 */
export const CardShell = ({
  card,
  icon,
  isResolving,
  children,
  onOpenDocument,
}: {
  card: ActionCard;
  icon: string;
  isResolving: boolean;
  children: React.ReactNode;
  onOpenDocument?: (docId: string) => void;
}) => {
  const priorityColor =
    card.priority === "P0"
      ? "#d32f2f"
      : card.priority === "P1"
      ? "#f57c00"
      : card.priority === "P2"
      ? "#1976d2"
      : "#757575";

  return (
    <Card
      sx={{
        mb: 1.5,
        cursor: "pointer",
        transition: "all 0.2s",
        borderLeft: "4px solid",
        borderColor: priorityColor,
        opacity: card.status === CardStatus.Resolved ? 0.5 : 1,
        "&:hover": { boxShadow: 3 },
        animation: "cardEnter 0.4s ease-out",
        "@keyframes cardEnter": {
          "0%": { opacity: 0, transform: "translateY(12px) scale(0.98)" },
          "100%": {
            opacity: card.status === CardStatus.Resolved ? 0.5 : 1,
            transform: "translateY(0) scale(1)",
          },
        },
      }}
    >
      <CardContent sx={{ pb: 1, pt: 1.5, px: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Box sx={{ fontSize: 18 }}>{icon}</Box>
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

        {children}
      </Box>
    </Card>
  );
};