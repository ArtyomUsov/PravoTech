import React from "react";
import { Box, Typography } from "@mui/material";

export const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      p: 4,
      color: "#999",
      height: "100%",
    }}
  >
    <Box sx={{ fontSize: 48, mb: 2 }}>{icon ?? "📭"}</Box>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {description}
      </Typography>
    )}
  </Box>
);

export const LoadingState = ({ height = 200 }: { height?: number }) => (
  <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
    {[1, 2, 3].map((i) => (
      <Box
        key={i}
        sx={{
          height: 20,
          borderRadius: 1,
          bgcolor: "#e0e0e0",
          width: `${60 + i * 15}%`,
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
