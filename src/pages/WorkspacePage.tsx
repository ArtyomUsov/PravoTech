import React from "react";
import { observer } from "mobx-react-lite";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { useMobx } from "../app/providers";
import { WorkspaceViewModel } from "../core/viewmodels/WorkspaceViewModel";
import { ChatPanel } from "../core/views/chat/ChatPanel";
import { CardQueuePanel } from "../core/views/card/CardQueuePanel";
import { CalendarPanel } from "../core/views/calendar/CalendarPanel";
import { SideListPanel } from "../core/views/common/SideListPanel";
import { ChatThreadItem } from "../core/views/chat/ChatThreadItem";
import { LoadingState } from "../core/views/common/EmptyState";
import { AuditPanel } from "../core/views/audit/AuditPanel";
import { Document } from "../core/models/Document";

const WorkspaceContent = observer(
  ({
    wsVM,
    onOpenDocument,
    onExpandCard,
  }: {
    wsVM: WorkspaceViewModel;
    onOpenDocument: (docId: string) => void;
    onExpandCard?: (cardId: string) => void;
  }) => {
    if (wsVM.isLoading) {
      return <LoadingState height={400} />;
    }

    const threadItems = wsVM.chatThreads.map((t) => ({
      id: t.id,
      title: t.title,
      lastActivity: t.lastActivity,
      messageCount: t.messages.length,
    }));

    const activeTab = wsVM.config.tabs.find((t) => t.id === wsVM.activeTabId);

    // Фильтрация документов/событий по workspaceFilter вкладки (если задан)
    const filteredDocuments = activeTab?.workspaceFilter
      ? wsVM.documents.filter(
          (d) => d.workspaceId === activeTab.workspaceFilter
        )
      : wsVM.documents;

    const filteredEvents = activeTab?.workspaceFilter
      ? wsVM.calendarEvents.filter(
          (e) => e.workspaceId === activeTab.workspaceFilter
        )
      : wsVM.calendarEvents;

    // Контент центральной панели в зависимости от типа вкладки
    const renderCenterContent = () => {
      switch (activeTab?.type) {
        case "document-list":
          return (
            <DocumentListPanel
              documents={filteredDocuments}
              onOpenDocument={onOpenDocument}
            />
          );
        case "event-list":
          return <AuditPanel entries={wsVM.auditEntries} />;
        case "chat-list":
        default:
          return (
            <ChatPanel
              chatVM={wsVM.chatVM}
              onOpenDocument={onOpenDocument}
              onExpandCard={onExpandCard}
            />
          );
      }
    };

    return (
      <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
        {/* Список чатов — слева */}
        <SideListPanel
          title="Чаты-задачи"
          items={threadItems}
          selectedItem={wsVM.activeThreadId}
          onSelect={(id) => wsVM.selectThread(id)}
          emptyText="Нет чатов"
          renderItem={(item, selected) => (
            <ChatThreadItem
              key={item.id}
              thread={item}
              selected={selected}
              onSelect={(id) => wsVM.selectThread(id)}
            />
          )}
        />

        {/* Центр — вкладки + контент в зависимости от типа вкладки */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRight: "1px solid #e0e0e0",
            Width: 1000,
            minWidth: 300,
          }}
        >
          {/* Вкладки над чатом */}
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fff" }}
          >
            <Tabs
              value={wsVM.activeTabId}
              onChange={(_, val) => wsVM.selectTab(val)}
              sx={{
                minHeight: 40,
                "& .MuiTab-root": { minHeight: 40, py: 0.5, fontSize: 13 },
              }}
            >
              {wsVM.config.tabs.map((tab) => (
                <Tab key={tab.id} label={tab.label} value={tab.id} />
              ))}
            </Tabs>
          </Box>

          {/* Контент вкладки */}
          {renderCenterContent()}
        </Box>

        {/* Правая панель — карточки + календарь */}
        <Box
          sx={{
            width: 500,
            minWidth: 500,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <CardQueuePanel
              cardQueueVM={wsVM.cardQueueVM}
              onOpenDocument={onOpenDocument}
            />
          </Box>
          <Box sx={{ overflowY: "auto" }}>
            <CalendarPanel events={wsVM.calendarEvents} />
          </Box>
        </Box>
      </Box>
    );
  }
);

/** Простой список документов для вкладки */
const docTypeLabels: Record<string, string> = {
  contract: "Договор",
  court_doc: "Судебный документ",
  appendix: "Приложение",
  template: "Шаблон",
};

const DocumentListPanel = ({
  documents,
  onOpenDocument,
}: {
  documents: Document[];
  onOpenDocument?: (docId: string) => void;
}) => (
  <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
    {documents.length === 0 ? (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mt: 4 }}
      >
        Нет документов
      </Typography>
    ) : (
      documents.map((doc) => (
        <Box
          key={doc.id}
          onClick={() => onOpenDocument?.(doc.id)}
          sx={{
            p: 1.5,
            mb: 1,
            bgcolor: "#fff",
            borderRadius: 1,
            border: "1px solid #e0e0e0",
            "&:hover": { borderColor: "#8C26EA", cursor: "pointer" },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {doc.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {docTypeLabels[doc.type] || doc.type}
          </Typography>
        </Box>
      ))
    )}
  </Box>
);

export const WorkspacePage = observer(
  ({
    workspaceId,
    onOpenDocument,
    onExpandCard,
  }: {
    workspaceId: string;
    onOpenDocument: (docId: string) => void;
    onExpandCard?: (cardId: string) => void;
  }) => {
    const store = useMobx();
    const wsVM = store.getWorkspace(workspaceId);

    if (!wsVM) {
      return (
        <Box sx={{ p: 4, textAlign: "center", color: "#999" }}>
          <Typography>Пространство не найдено</Typography>
        </Box>
      );
    }

    return (
      <WorkspaceContent
        wsVM={wsVM}
        onOpenDocument={onOpenDocument}
        onExpandCard={onExpandCard}
      />
    );
  }
);
