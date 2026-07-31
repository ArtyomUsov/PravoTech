import React from "react";
import { observer } from "mobx-react-lite";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useMobx } from "../../../app/providers";
import { MessageBubble } from "./MessageBubble";
import { ChatViewModel } from "../../viewmodels/ChatViewModel";
import { EmptyState } from "../common/EmptyState";

export const ChatPanel = observer(
  ({
    chatVM,
    onOpenDocument,
    onExpandCard,
  }: {
    chatVM: ChatViewModel;
    onOpenDocument?: (docId: string) => void;
    onExpandCard?: (cardId: string) => void;
  }) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [
      chatVM.messages.length,
      chatVM.messages[chatVM.messages.length - 1]?.content,
    ]);

    const handleSend = () => {
      chatVM.sendMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", py: 2 }}>
          {chatVM.messages.length === 0 ? (
            <EmptyState
              icon="💬"
              title="Нет сообщений"
              description="Задайте вопрос агенту — он ответит"
            />
          ) : (
            chatVM.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onOpenDocument={onOpenDocument}
                onExpandCard={onExpandCard}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", bgcolor: "#fff" }}>
          <TextField
            fullWidth
            size="small"
            multiline
            maxRows={3}
            placeholder="Напишите сообщение агенту..."
            value={chatVM.inputValue}
            onChange={(e) => chatVM.setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={chatVM.isStreaming}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSend}
                    disabled={chatVM.isStreaming || !chatVM.inputValue.trim()}
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    );
  }
);
