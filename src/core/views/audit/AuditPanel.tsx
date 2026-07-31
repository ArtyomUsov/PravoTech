import React from "react";
import { Box, Typography, List, ListItem, Chip, Divider } from "@mui/material";
import { AuditEntry } from "../../domain/AuditEntry";

const actionIcons: Record<string, string> = {
  "card:resolved": "✅",
  "card:created": "🆕",
  "document:created": "📄",
  "document:viewed": "👁",
  "agent:note": "💬",
};

const actionLabels: Record<string, string> = {
  "card:resolved": "Действие выполнено",
  "card:created": "Создана карточка",
  "document:created": "Создан документ",
  "document:viewed": "Просмотр документа",
  "agent:note": "Заметка агента",
};

const actorColors: Record<string, string> = {
  agent: "#00897b",
  user: "#8C26EA",
};

export const AuditPanel = ({ entries }: { entries: AuditEntry[] }) => {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sorted.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center", color: "#999" }}>
        <Typography variant="body2">Нет событий</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ px: 1, mb: 1, fontWeight: 600 }}>
        История действий
      </Typography>
      <List dense disablePadding>
        {sorted.map((entry, i) => {
          const icon = actionIcons[entry.action] || "📌";
          const label = actionLabels[entry.action] || entry.action;
          const actorColor = actorColors[entry.actor] || "#757575";

          return (
            <React.Fragment key={entry.id}>
              {i > 0 && <Divider component="li" sx={{ mx: 1 }} />}
              <ListItem
                sx={{
                  px: 1,
                  py: 1,
                  borderRadius: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                {/* Верхняя строка: иконка + действие + кто */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    width: "100%",
                  }}
                >
                  <Box sx={{ fontSize: 14, flexShrink: 0 }}>{icon}</Box>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: 13, fontWeight: 500, flex: 1 }}
                  >
                    {entry.summary}
                  </Typography>
                  <Chip
                    label={entry.actor === "agent" ? "Агент" : "Вы"}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      bgcolor: `${actorColor}15`,
                      color: actorColor,
                      border: `1px solid ${actorColor}30`,
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  />
                </Box>

                {/* Нижняя строка: время + тип действия */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.25,
                    ml: 3.25,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#999", fontSize: 11 }}
                  >
                    {new Date(entry.timestamp).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                  <Chip
                    label={label}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: 9,
                      bgcolor: "#f0f0f0",
                      color: "#666",
                    }}
                  />
                </Box>
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};
