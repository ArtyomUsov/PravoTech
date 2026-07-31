import React from "react";
import { Box, Typography, Stack } from "@mui/material";

export interface SideListItem {
  id: string;
}

interface SideListPanelProps<T extends SideListItem> {
  title: string;
  items: T[];
  selectedItem?: string | null;
  onSelect: (id: string) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  emptyText?: string;
}

export const SideListPanel = <T extends SideListItem>({
  title,
  items,
  selectedItem,
  onSelect,
  renderItem,
  emptyText = "Нет данных",
}: SideListPanelProps<T>) => {
  return (
    <Box
      sx={{
        width: 260,
        minWidth: 260,
        borderRight: "1px solid #e0e0e0",
        borderRadius: 4,
        overflowY: "auto",
        bgcolor: "transparent",
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {items.length === 0 ? emptyText : `${title}: ${items.length}`}
        </Typography>
      </Box>
      <Stack spacing={1} sx={{ px: 1, py: 0.5 }}>
        {items.map((item) =>
          renderItem(item, item.id === selectedItem)
        )}
      </Stack>
    </Box>
  );
};
