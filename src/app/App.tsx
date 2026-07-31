import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";
import { Providers, useMobx } from "./providers";
import { NavigationRail } from "../core/views/layout/NavigationRail";
import { TodayPage } from "../pages/TodayPage";
import { WorkspacePage } from "../pages/WorkspacePage";
import { DocumentDrawer } from "../core/views/document/DocumentDrawer";

type Page = "today" | "workspace" | "settings";

const AppContent = observer(() => {
  const store = useMobx();
  const [currentPage, setCurrentPage] = React.useState<Page>("today");
  const [currentWorkspaceId, setCurrentWorkspaceId] = React.useState<
    string | null
  >(null);
  const [documentDrawerOpen, setDocumentDrawerOpen] = React.useState(false);
  const [documentId, setDocumentId] = React.useState<string | undefined>();

  // Инициализация Today при первом рендере
  useEffect(() => {
    store.todayVM.init();
  }, []);

  const handleNavigate = (page: Page, workspaceId?: string) => {
    setCurrentPage(page);
    if (workspaceId) {
      setCurrentWorkspaceId(workspaceId);
      store.setCurrentWorkspace(workspaceId);
      const ws = store.getWorkspace(workspaceId);
      if (ws) ws.init();
    } else {
      setCurrentWorkspaceId(null);
      store.setCurrentWorkspace(null);
      store.cardQueueVM.setThreadFilter(null);
      store.cardQueueVM.setCardTypeFilter(null);
    }
  };

  const handleOpenDocument = (docId: string) => {
    setDocumentId(docId);
    setDocumentDrawerOpen(true);
  };

  const handleExpandCard = (cardId: string) => {
    if (currentPage === "today") {
      // Сначала проверяем очередь, потом задачи
      store.todayVM.cardQueueVM.setExpandedCardId(cardId);
      store.todayVM.taskListVM.selectTask(cardId);
    } else if (currentWorkspaceId) {
      const ws = store.getWorkspace(currentWorkspaceId);
      if (ws) {
        ws.cardQueueVM.setExpandedCardId(cardId);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background:
          "linear-gradient(to bottom right, #f3f0fc 0%, #fff 50%, #fff 60%, #f3f0fc 100%)",
      }}
    >
      <NavigationRail
        currentPage={currentPage}
        currentWorkspaceId={currentWorkspaceId}
        onNavigate={handleNavigate}
      />

      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        {currentPage === "today" && (
          <TodayPage
            onOpenDocument={handleOpenDocument}
            onExpandCard={handleExpandCard}
          />
        )}
        {currentPage === "workspace" && currentWorkspaceId && (
          <WorkspacePage
            workspaceId={currentWorkspaceId}
            onOpenDocument={handleOpenDocument}
            onExpandCard={handleExpandCard}
          />
        )}
        {currentPage === "settings" && (
          <Box sx={{ p: 4, color: "#666" }}>
            <h2>Настройки</h2>
            <p>Раздел в разработке</p>
          </Box>
        )}
      </Box>

      <DocumentDrawer
        open={documentDrawerOpen}
        documentId={documentId}
        onClose={() => setDocumentDrawerOpen(false)}
      />
    </Box>
  );
});

export function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}
