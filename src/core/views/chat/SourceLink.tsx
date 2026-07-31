import React from "react";
import { Chip, Typography, Box } from "@mui/material";
import { SourceRef } from "../../models/ActionCard";
import { Description, AssignmentTurnedIn } from "@mui/icons-material";

const typeIcons: Record<string, React.ElementType> = {
  document: Description,
  card: AssignmentTurnedIn,
};

const typeColors: Record<string, string> = {
  document: "#1976d2",
  card: "#00897b",
};

const typeLabels: Record<string, string> = {
  document: "Документ",
  card: "Карточка",
};

export const SourceLink = ({
  sourceRef,
  onOpenDocument,
  onOpenCard,
}: {
  sourceRef: SourceRef;
  onOpenDocument?: (docId: string) => void;
  onOpenCard?: (cardId: string) => void;
}) => {
  const Icon = typeIcons[sourceRef.type] || Description;
  const color = typeColors[sourceRef.type] || "#1976d2";

  const handleClick = () => {
    if (sourceRef.type === "document" && onOpenDocument) {
      onOpenDocument(sourceRef.targetId);
    } else if (sourceRef.type === "card" && onOpenCard) {
      onOpenCard(sourceRef.targetId);
    }
  };

  return (
    <Box
      sx={{
        mb: 0.5,
        cursor: "pointer",
        "&:hover": {
          opacity: 0.8,
        },
      }}
      onClick={handleClick}
    >
      <Chip
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Icon sx={{ fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{
                color: "text.primary",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 200,
              }}
            >
              {sourceRef.title}
            </Typography>
          </Box>
        }
        size="small"
        sx={{
          bgcolor: `${color}15`,
          color: color,
          border: `1px solid ${color}30`,
          fontSize: 11,
          height: 24,
          "&:hover": {
            bgcolor: `${color}25`,
          },
        }}
      />
      {sourceRef.section && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#999",
            ml: 1,
            mt: 0.5,
          }}
        >
          → {sourceRef.section}
        </Typography>
      )}
    </Box>
  );
};
