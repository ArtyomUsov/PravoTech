import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { ActionCard } from "../../models/ActionCard";

/**
 * Renders digest text with inline arrow buttons for each bullet item.
 *
 * During streaming (isStreaming=true), the last line is considered incomplete
 * and won't get a button. Buttons appear progressively as cards are added
 * to embeddedCards via MobX reactivity.
 */
export const DigestText = ({
  content,
  embeddedCards,
  isStreaming,
  onExpandCard,
}: {
  content: string;
  embeddedCards?: ActionCard[];
  isStreaming: boolean;
  onExpandCard?: (cardId: string) => void;
}) => {
  const lines = content.split("\n");

  return (
    <Box
      sx={{
        whiteSpace: "pre-wrap",
        lineHeight: 1.6,
        "& strong": { fontWeight: 600 },
      }}
    >
      {lines.map((line, index) => {
        const isLastLine = index === lines.length - 1;
        const isIncomplete = isStreaming && isLastLine;

        // Проверяем, является ли строка буллет-пунктом
        const trimmed = line.trim();
        const isBullet =
          trimmed.startsWith("•") ||
          trimmed.startsWith("🔴") ||
          trimmed.startsWith("🟠") ||
          trimmed.startsWith("🔵") ||
          trimmed.startsWith("📅");

        // Ищем карточку, чей title содержится в строке
        const card: ActionCard | undefined = isBullet
          ? embeddedCards?.find((c) => {
              // Ищем по title: строка содержит ключевые слова из title
              const titleWords = c.title.toLowerCase().split(/\s+/);
              const lineLower = trimmed.toLowerCase();
              // Совпадение, если хотя бы первые 3 слова title есть в строке
              const matchCount = titleWords.filter(
                (w) => w.length > 3 && lineLower.includes(w)
              ).length;
              return matchCount >= Math.min(3, titleWords.length);
            })
          : undefined;

        const showArrow = card && !isIncomplete;

        return (
          <Box
            key={index}
            component="span"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.5,
            }}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                display: "inline",
                "& strong": { fontWeight: 600 },
              }}
            >
              {line}
              {index < lines.length - 1 && "\n"}
            </Typography>

            {showArrow && (
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpandCard?.(card!.id);
                }}
                sx={{
                  minWidth: 80,
                  height: "1em",
                  p: 0,
                  flexShrink: 0,
                  mt: 0.5,
                  bgcolor: "#f0e6ff",
                  color: "#fff",
                  borderRadius: "4px",
                  lineHeight: 1,
                  "&:hover": {
                    bgcolor: "#7c1ad6",
                  },
                }}
              >
                <ArrowForward sx={{ fontSize: 14 }} />
              </Button>
            )}
          </Box>
        );
      })}

      {/* Курсор стриминга — в конце текста */}
      {isStreaming && (
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
    </Box>
  );
};
