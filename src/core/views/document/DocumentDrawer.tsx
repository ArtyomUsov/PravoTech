import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Skeleton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMobx } from "../../../app/providers";
import { Document } from "../../models/Document";

export const DocumentDrawer = ({
  open,
  documentId,
  onClose,
}: {
  open: boolean;
  documentId?: string;
  onClose: () => void;
}) => {
  const store = useMobx();
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !documentId) return;
    setLoading(true);
    setError(null);
    store.container.document.getDocumentById(documentId).then((result) => {
      if (result) {
        setDoc(result);
      } else {
        setError("Документ не найден");
      }
      setLoading(false);
    });
  }, [open, documentId, store.container.document]);

  const typeLabels: Record<string, string> = {
    contract: "Договор",
    court_doc: "Судебный документ",
    appendix: "Приложение",
    template: "Шаблон",
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 1200,
          maxWidth: "90vw",
          p: 0,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>
          {doc?.title ?? "Документ"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>
      <Divider />

      {loading && (
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ mt: 2, borderRadius: 1 }}
          />
        </Box>
      )}

      {error && (
        <Box sx={{ p: 3, textAlign: "center", color: "#d32f2f" }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      {doc && !loading && (
        <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={typeLabels[doc.type] || doc.type}
              size="small"
              color="primary"
            />
            {Object.entries(doc.metadata).map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: 11 }}
              />
            ))}
          </Box>

          {doc.sections.map((section) => (
            <Box key={section.id} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#1a237e", mb: 0.5 }}
              >
                {section.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                  color: "#444",
                }}
              >
                {section.content}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Drawer>
  );
};
