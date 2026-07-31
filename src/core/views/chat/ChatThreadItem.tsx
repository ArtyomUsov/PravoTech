import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

export interface ChatThreadItemData {
  id: string;
  title: string;
  lastActivity: string;
  messageCount: number;
}

export const ChatThreadItem = ({
  thread,
  selected,
  onSelect,
}: {
  thread: ChatThreadItemData;
  selected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <Card
      sx={{
        bgcolor: selected ? "#fff" : "#0d06280f",
        borderRight: selected ? "3px solid #8C26EA" : "3px solid transparent",
        transition: "all 0.2s",
        boxShadow: "none",
        "&:hover": {
          bgcolor: selected ? "#0d06280f" : "#f3f0fc",
          borderRight: "1px solid #8C26EA",
        },
      }}
    >
      <CardActionArea
        onClick={() => onSelect(thread.id)}
        sx={{ px: 1.5, py: 1.5 }}
      >
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
            {thread.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(thread.lastActivity).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" · "}
            {thread.messageCount} сообщ.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
