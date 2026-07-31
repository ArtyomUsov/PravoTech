import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Message, Role } from "../../models/Message";
import { SourceLink } from "./SourceLink";
import { DigestText } from "./DigestText";

export const MessageBubble = ({
  message,
  onOpenDocument,
  onExpandCard,
}: {
  message: Message;
  onOpenDocument?: (docId: string) => void;
  onExpandCard?: (cardId: string) => void;
}) => {
  const isUser = message.role === Role.User;
  const isAgent = message.role === Role.Agent;
  const isSystem = message.role === Role.System;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 1.5,
        mb: 2,
        px: 2,
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: isUser ? "#8C26EA" : isAgent ? "#00897b" : "#e0e0e0",
          fontSize: 14,
          color: isSystem ? "#666" : "#fff",
        }}
      >
        {isUser ? "Вы" : isAgent ? "А" : "i"}
      </Avatar>

      <Box
        sx={{
          width: "100%",
          maxWidth: "75%",
          bgcolor: isUser ? "#f5f5f5" : isSystem ? "#fff" : "#fff",
          color: isUser ? "#fff" : "inherit",
          borderRadius: 2,
          borderTopRightRadius: isUser ? 4 : 2,
          borderTopLeftRadius: isUser ? 2 : 4,
          p: 1.5,
          border: isSystem ? "1px solid #e0e0e0" : "none",
          boxShadow: isSystem ? "none" : "0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        {/* Парсим текст дайджеста: inline-стрелки для буллет-пунктов */}
        {message.embeddedCards && message.embeddedCards.length > 0 ? (
          <DigestText
            content={message.content}
            embeddedCards={message.embeddedCards}
            isStreaming={message.isStreaming ?? false}
            onExpandCard={onExpandCard}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              "& strong": { fontWeight: 600 },
            }}
          >
            {message.content}
            {message.isStreaming && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 8,
                  height: 16,
                  bgcolor: "#00897b",
                  ml: 0.5,
                  animation: "blink 1s step-end infinite",
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0 },
                  },
                }}
              />
            )}
          </Typography>
        )}

        {message.sourceRefs && message.sourceRefs.length > 0 && (
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: "1px solid",
              borderColor: isUser ? "rgba(255,255,255,0.2)" : "#e0e0e0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: isUser ? "rgba(255,255,255,0.7)" : "#999",
                display: "block",
                mb: 0.5,
              }}
            >
              Источники:
            </Typography>
            {message.sourceRefs.map((ref, i) => (
              <SourceLink
                key={i}
                sourceRef={ref}
                onOpenDocument={onOpenDocument}
                onOpenCard={onExpandCard}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};
