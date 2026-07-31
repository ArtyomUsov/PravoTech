import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Chip,
  LinearProgress,
} from "@mui/material";
import { CalendarEvent } from "../../models/CalendarEvent";

const eventColors: Record<string, string> = {
  deadline: "#d32f2f",
  hearing: "#1976d2",
  meeting: "#00897b",
  reminder: "#757575",
};

const eventLabels: Record<string, string> = {
  deadline: "Срок",
  hearing: "Заседание",
  meeting: "Встреча",
  reminder: "Напоминание",
};

export const CalendarPanel = ({
  events,
  onOpenCard,
  isAgentWorking,
}: {
  events: CalendarEvent[];
  onOpenCard?: (cardId: string) => void;
  isAgentWorking?: boolean;
}) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Агент анализирует — ещё нет событий
  if (isAgentWorking && sortedEvents.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{
              color: "#8C26EA",
              fontWeight: 500,
              display: "block",
              mb: 1,
            }}
          >
            Агент анализирует документы...
          </Typography>
          <LinearProgress
            sx={{
              height: 3,
              borderRadius: 2,
              bgcolor: "#f0e6ff",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#8C26EA",
                borderRadius: 2,
              },
            }}
          />
        </Box>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              height: 40,
              borderRadius: 2,
              bgcolor: "#f0f0f0",
              mb: 1.5,
              animation: "pulse 1.5s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 0.6 },
                "50%": { opacity: 0.2 },
              },
            }}
          />
        ))}
      </Box>
    );
  }

  if (sortedEvents.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center", color: "#999" }}>
        <Typography variant="body2">Нет событий</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ px: 1, mb: 1, fontWeight: 600 }}>
        Календарь
      </Typography>
      <List dense disablePadding>
        {sortedEvents.map((event) => (
          <ListItem
            key={event.id}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              "&:hover": { bgcolor: "#f5f5f5" },
              cursor: event.relatedCardId ? "pointer" : "default",
            }}
            onClick={() =>
              event.relatedCardId && onOpenCard?.(event.relatedCardId)
            }
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flex: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Chip
                  label={eventLabels[event.type]}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 9,
                    bgcolor: eventColors[event.type],
                    color: "#fff",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 500 }}
                >
                  {event.title}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: event.priority === "high" ? "#d32f2f" : "#999",
                  fontWeight: event.priority === "high" ? 600 : 400,
                  display: "block",
                  mt: 0.25,
                }}
              >
                {new Date(event.date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                })}
                {event.priority === "high" && " • 🔴 Важно"}
              </Typography>
            </Box>
            {event.relatedCardId && (
              <Typography
                variant="caption"
                sx={{ color: "#8C26EA", ml: 0.5, flexShrink: 0 }}
              >
                →
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
