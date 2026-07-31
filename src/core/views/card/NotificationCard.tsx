import React from "react";
import { CardActions, Button } from "@mui/material";
import { CardProps } from "./CardProps";
import { CardShell } from "./CardShell";

export const NotificationCard = ({
  card,
  isResolving,
  onResolve,
  onOpenDocument,
}: CardProps) => (
  <CardShell
    card={card}
    icon="📨"
    isResolving={isResolving}
    onOpenDocument={onOpenDocument}
  >
    <CardActions sx={{ px: 0, gap: 0.5, flexWrap: "wrap" }}>
      <Button
        size="small"
        variant="contained"
        color="primary"
        disabled={isResolving}
        onClick={(e) => {
          e.stopPropagation();
          onResolve("approved");
        }}
        sx={{ fontSize: 12, py: 0.25 }}
      >
        Отправлено
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        disabled={isResolving}
        onClick={(e) => {
          e.stopPropagation();
          onResolve("modified");
        }}
        sx={{ fontSize: 12, py: 0.25 }}
      >
        Изменить
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        disabled={isResolving}
        onClick={(e) => {
          e.stopPropagation();
          onResolve("rejected");
        }}
        sx={{ fontSize: 12, py: 0.25 }}
      >
        Отклонить
      </Button>
    </CardActions>
  </CardShell>
);
