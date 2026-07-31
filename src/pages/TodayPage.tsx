import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography } from "@mui/material";
import { useMobx } from "../app/providers";
import { ChatPanel } from "../core/views/chat/ChatPanel";
import { CardQueuePanel } from "../core/views/card/CardQueuePanel";
import { CalendarPanel } from "../core/views/calendar/CalendarPanel";
import { TaskListPanel } from "../core/views/task/TaskListPanel";
import { LoadingState } from "../core/views/common/EmptyState";

export const TodayPage = observer(
  ({
    onOpenDocument,
    onExpandCard,
  }: {
    onOpenDocument: (docId: string) => void;
    onExpandCard?: (cardId: string) => void;
  }) => {
    const store = useMobx();
    const { todayVM } = store;

    return (
      <Box
        sx={{
          display: "flex",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Список задач — слева */}
        <TaskListPanel
          taskListVM={todayVM.taskListVM}
          onOpenDocument={onOpenDocument}
        />

        {/* Чат — центр */}
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
          <ChatPanel
            chatVM={todayVM.chatVM}
            onOpenDocument={onOpenDocument}
            onExpandCard={onExpandCard}
          />
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
              cardQueueVM={todayVM.cardQueueVM}
              onOpenDocument={onOpenDocument}
            />
          </Box>

          <Box sx={{ overflowY: "auto" }}>
            <CalendarPanel
              events={todayVM.calendarEventList}
              onOpenCard={onExpandCard}
              isAgentWorking={todayVM.cardQueueVM.isAgentWorking}
            />
          </Box>
        </Box>
      </Box>
    );
  }
);
