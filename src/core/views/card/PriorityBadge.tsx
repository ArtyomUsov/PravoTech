import React from "react";
import { Chip } from "@mui/material";
import { Priority } from "../../models/Priority";

const priorityColors: Record<Priority, string> = {
  [Priority.P0]: "#d32f2f",
  [Priority.P1]: "#f57c00",
  [Priority.P2]: "#1976d2",
  [Priority.P3]: "#757575",
};

const priorityLabels: Record<Priority, string> = {
  [Priority.P0]: "P0",
  [Priority.P1]: "P1",
  [Priority.P2]: "P2",
  [Priority.P3]: "P3",
};

export const PriorityBadge = ({
  priority,
  size = "medium",
}: {
  priority: Priority;
  size?: "small" | "medium";
}) => (
  <Chip
    label={priorityLabels[priority]}
    size={size}
    sx={{
      bgcolor: priorityColors[priority],
      color: "#fff",
      fontWeight: 700,
      fontSize: size === "small" ? 10 : 11,
      height: size === "small" ? 20 : 22,
    }}
  />
);
