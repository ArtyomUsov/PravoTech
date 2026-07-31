import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography, LinearProgress, IconButton } from "@mui/material";
import { CardQueueViewModel } from "../../viewmodels/CardQueueViewModel";
import { cardComponents } from "./cardRegistry";
import { EmptyState } from "../common/EmptyState";

export const CardQueuePanel = observer(
  ({
    cardQueueVM,
    onOpenDocument,
  }: {
    cardQueueVM: CardQueueViewModel;
    onOpenDocument?: (docId: string) => void;
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleResolve = async (
      cardId: string,
      decision: "approved" | "modified" | "rejected" | "acknowledged"
    ) => {
      await cardQueueVM.resolveCard(cardId, decision);
    };

    const cards = cardQueueVM.sortedCards;
    const isAgentWorking = cardQueueVM.isAgentWorking;

    // Синхронизация слайдера с expandedCardId (из DigestText → inline arrow)
    useEffect(() => {
      const expandedId = cardQueueVM.expandedCardId;
      if (expandedId) {
        const idx = cards.findIndex((c) => c.id === expandedId);
        if (idx >= 0 && idx !== currentIndex) {
          setCurrentIndex(idx);
        }
      }
    }, [cardQueueVM.expandedCardId]);

    // Если карточка resolved (исчезла из списка) — корректируем индекс
    useEffect(() => {
      if (currentIndex >= cards.length && cards.length > 0) {
        setCurrentIndex(cards.length - 1);
      }
    }, [cards.length, currentIndex]);

    const goPrev = () => {
      setCurrentIndex((i) => (i > 0 ? i - 1 : i));
    };

    const goNext = () => {
      setCurrentIndex((i) => (i < cards.length - 1 ? i + 1 : i));
    };

    // Агент анализирует документы — ещё ни одной карточки
    if (isAgentWorking && cards.length === 0) {
      return (
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: "#8C26EA",
                fontWeight: 500,
                display: "block",
                mb: 1,
              }}
            >
              Агент анализирует документы...
            </Typography>
            <LinearProgress
              sx={{
                height: 3,
                borderRadius: 2,
                bgcolor: "#f0e6ff",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#8C26EA",
                  borderRadius: 2,
                },
              }}
            />
          </Box>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                height: 80,
                borderRadius: 2,
                bgcolor: "#f0f0f0",
                mb: 1.5,
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
    }

    if (cards.length === 0) {
      return (
        <EmptyState
          icon="🎉"
          title="Все карточки обработаны"
          description="Нет ожидающих действий"
        />
      );
    }

    const currentCard = cards[currentIndex];
    const CardComponent = currentCard ? cardComponents[currentCard.type] : null;

    return (
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Заголовок + индикатор работы агента */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            px: 0.5,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Очередь действий
          </Typography>
          {isAgentWorking && (
            <Typography
              variant="caption"
              sx={{ color: "#8C26EA", ml: "auto", fontSize: 11 }}
            >
              Агент работает...
            </Typography>
          )}
        </Box>

        {/* Минималистичный слайдер переключения */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            mb: 1.5,
          }}
        >
          <IconButton
            size="small"
            onClick={goPrev}
            disabled={currentIndex === 0}
            sx={{
              width: 24,
              height: 24,
              opacity: currentIndex === 0 ? 0.3 : 0.6,
              "&:hover": { opacity: 1, bgcolor: "transparent" },
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </IconButton>

          {/* Точки (dots) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            {cards.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  width: idx === currentIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: idx === currentIndex ? "#8C26EA" : "#d0d0d0",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: idx === currentIndex ? "#8C26EA" : "#bbb",
                  },
                }}
              />
            ))}
          </Box>

          <IconButton
            size="small"
            onClick={goNext}
            disabled={currentIndex === cards.length - 1}
            sx={{
              width: 24,
              height: 24,
              opacity: currentIndex === cards.length - 1 ? 0.3 : 0.6,
              "&:hover": { opacity: 1, bgcolor: "transparent" },
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </IconButton>
        </Box>

        {/* Текущая карточка — компонент-стратегия */}
        {currentCard && CardComponent && (
          <CardComponent
            key={currentCard.id}
            card={currentCard}
            isResolving={cardQueueVM.isResolving(currentCard.id)}
            onResolve={(decision) => handleResolve(currentCard.id, decision)}
            onOpenDocument={onOpenDocument}
          />
        )}
      </Box>
    );
  }
);
