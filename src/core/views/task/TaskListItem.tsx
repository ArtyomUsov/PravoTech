import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Collapse,
  Divider,
} from "@mui/material";
import { ActionCard } from "../../models/ActionCard";
import { PriorityBadge } from "../card/PriorityBadge";
import { SourceLink } from "../chat/SourceLink";

const actionColors: Record<string, string> = {
  "Ожидает действия": "#f57c00",
  "✅ Обработано": "#2e7d32",
  "✏️ Изменено": "#1976d2",
  "❌ Отклонено": "#d32f2f",
  "👁 Принято к сведению": "#757575",
};

export const TaskListItem = ({
  card,
  selected,
  actionLabel,
  progress,
  onSelect,
  onOpenDocument,
}: {
  card: ActionCard;
  selected: boolean;
  actionLabel: string;
  progress?: number;
  onSelect: (cardId: string | null) => void;
  onOpenDocument?: (docId: string) => void;
}) => {
  const isProcessing = progress !== undefined && progress < 100;
  const color = actionColors[actionLabel] || "#757575";

  return (
    <Card
      sx={{
        bgcolor: "#fff",
        borderRight: selected ? "3px solid #8C26EA" : "3px solid transparent",
        borderLeft: selected ? "1px solid #8C26EA" : "1px solid transparent",
        borderTop: selected ? "1px solid #8C26EA" : "1px solid transparent",
        borderBottom: selected ? "1px solid #8C26EA" : "1px solid transparent",
        transition: "all 0.2s",
        boxShadow: "none",
        "&:hover": {
          bgcolor: "#f3f0fc",
          borderRight: "1px solid #8C26EA",
        },
      }}
    >
      <CardActionArea
        onClick={() => onSelect(selected ? null : card.id)}
        sx={{ px: 1.5, py: 1.5 }}
      >
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          {/* Заголовок + приоритет */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}
          >
            <PriorityBadge priority={card.priority} size="small" />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: 13,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {card.title}
            </Typography>
          </Box>

          {isProcessing ? (
            /* Прогресс-бар обработки агентом */
            <Box sx={{ mt: 0.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.25,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#8C26EA", fontSize: 10, fontWeight: 500 }}
                >
                  Обработка агентом
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#8C26EA", fontSize: 10, fontWeight: 600 }}
                >
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: "#f0e6ff",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#8C26EA",
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          ) : (
            <Chip
              label={actionLabel}
              size="small"
              sx={{
                bgcolor: `${color}15`,
                color: color,
                border: `1px solid ${color}30`,
                fontSize: 10,
                height: 20,
                fontWeight: 500,
              }}
            />
          )}
        </CardContent>
      </CardActionArea>

      {/* Раскрывающаяся секция с деталями */}
      <Collapse in={selected && !isProcessing}>
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <Divider sx={{ mb: 1 }} />

          {/* Описание */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5, lineHeight: 1.5 }}
          >
            {card.description}
          </Typography>

          {/* Заметка агента */}
          {card.agentNote && (
            <Box
              sx={{
                p: 1,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  display: "block",
                  mb: 0.25,
                  color: "#666",
                }}
              >
                💬 Агент:
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#555", lineHeight: 1.5 }}
              >
                {card.agentNote}
              </Typography>
            </Box>
          )}

          {/* Контекст */}
          {card.context && Object.keys(card.context).length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  display: "block",
                  mb: 0.25,
                  color: "#666",
                }}
              >
                📋 Контекст:
              </Typography>
              {Object.entries(card.context).map(([key, value]) => (
                <Typography
                  key={key}
                  variant="caption"
                  sx={{ display: "block", color: "#777", ml: 1 }}
                >
                  {key}: {value}
                </Typography>
              ))}
            </Box>
          )}

          {/* Источники */}
          {card.sourceRefs.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  display: "block",
                  mb: 0.25,
                  color: "#666",
                }}
              >
                📎 Источники:
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

          {/* Результат */}
          {card.resolution && (
            <Box
              sx={{
                p: 1,
                bgcolor: "#f0fdf4",
                borderRadius: 1,
                border: "1px solid #bbf7d0",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  display: "block",
                  mb: 0.25,
                  color: "#166534",
                }}
              >
                ✓ Решение:{" "}
                {card.resolution.decision === "approved"
                  ? "Подтверждено"
                  : card.resolution.decision === "modified"
                  ? "Изменено"
                  : card.resolution.decision === "rejected"
                  ? "Отклонено"
                  : "Принято к сведению"}
              </Typography>
              {card.resolution.comment && (
                <Typography variant="caption" sx={{ color: "#166534" }}>
                  {card.resolution.comment}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};
