import React from "react";
import { CardActions, Button } from "@mui/material";
import { CardProps } from "./CardProps";
import { CardShell } from "./CardShell";

export const ReviewCard = ({
  card,
  isResolving,
  onResolve,
  onOpenDocument,
}: CardProps) => (
  <CardShell card={card} icon="🔍" isResolving={isResolving} onOpenDocument={onOpenDocument}>
    <CardActions sx={{ px: 0, gap: 0.5, flexWrap: "wrap" }}>
      <Button
        size="small"
        variant="contained"
        color="primary"
        disabled={isResolving}
        onClick={(e) => { e.stopPropagation(); onResolve("acknowledged"); }}
        sx={{ fontSize: 12, py: 0.25 }}
      >
        Принять к сведению
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        disabled={isResolving}
        onClick={(e) => { e.stopPropagation(); onResolve("approved"); }}
        sx={{ fontSize: 12, py: 0.25 }}
      >
        Создать задачу
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        disabled={isResolving}
        onClick={(e) => { e.stopPropagation(); onResolve("rejected"); }}
        sx={{ fontSize: 12, py: 0.25 }}
      >
        Отклонить
      </Button>
    </CardActions>
  </CardShell>
);