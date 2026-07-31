import {
  makeObservable,
  observable,
  computed,
  action,
  autorun,
  runInAction,
} from "mobx";
import { BaseViewModel } from "../base/BaseViewModel";
import { CardQueueViewModel } from "./CardQueueViewModel";
import { DomainStore } from "../domain/DomainStore";
import { ActionCard, CardStatus } from "../models/ActionCard";
import { PRIORITY_ORDER } from "../models/Priority";

const PROCESSING_DURATION_MS = 5000;
const TICK_MS = 100;

export class TaskListViewModel extends BaseViewModel {
  cardQueueVM: CardQueueViewModel;
  domain: DomainStore;
  selectedTaskId: string | null = null;
  processingProgress: Record<string, number> = {};
  private seenIds: Set<string> = new Set();
  private timers: Record<string, ReturnType<typeof setInterval>> = {};
  private disposeAutorun: (() => void) | null = null;

  constructor(cardQueueVM: CardQueueViewModel, domain: DomainStore) {
    super(); // subscriptions + dispose
    makeObservable(this, {
      selectedTaskId: observable,
      processingProgress: observable,
      tasks: computed,
      selectedTask: computed,
      selectTask: action,
    });
    this.cardQueueVM = cardQueueVM;
    this.domain = domain;

    // Отслеживаем появление новых обработанных карточек
    this.disposeAutorun = autorun(() => {
      for (const card of this.tasks) {
        if (!this.seenIds.has(card.id)) {
          this.seenIds.add(card.id);
          this.startProcessing(card.id);
        }
      }
    });
  }

  override dispose(): void {
    // Очищаем все таймеры
    for (const id of Object.keys(this.timers)) {
      clearInterval(this.timers[id]);
    }
    this.timers = {};
    this.processingProgress = {};

    // Отписываем autorun
    this.disposeAutorun?.();

    super.dispose();
  }

  /** Только карточки, по которым уже выполнено действие */
  get tasks(): ActionCard[] {
    return [...this.cardQueueVM.cards]
      .filter((c) => c.status !== CardStatus.Pending)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }

  get selectedTask(): ActionCard | undefined {
    return this.cardQueueVM.cards.find((c) => c.id === this.selectedTaskId);
  }

  /** Прогресс обработки карточки (0–100), undefined если не в обработке */
  getProgress(cardId: string): number | undefined {
    return this.processingProgress[cardId];
  }

  selectTask(cardId: string | null) {
    this.selectedTaskId = cardId;
    this.cardQueueVM.setExpandedCardId(cardId);
  }

  /** Записи аудит-лога для выбранной задачи */
  getAuditForTask(cardId: string | null) {
    if (!cardId) return [];
    return this.domain.getAuditForCard(cardId);
  }

  /** Запуск имитации обработки агентом — 5 секунд */
  private startProcessing(cardId: string) {
    runInAction(() => {
      this.processingProgress = { ...this.processingProgress, [cardId]: 0 };
    });

    const tickCount = PROCESSING_DURATION_MS / TICK_MS;
    let tick = 0;

    this.timers[cardId] = setInterval(() => {
      tick++;
      const progress = Math.min(Math.round((tick / tickCount) * 100), 100);

      runInAction(() => {
        this.processingProgress = {
          ...this.processingProgress,
          [cardId]: progress,
        };
      });

      if (progress >= 100) {
        clearInterval(this.timers[cardId]);
        delete this.timers[cardId];

        runInAction(() => {
          const next = { ...this.processingProgress };
          delete next[cardId];
          this.processingProgress = next;
        });
      }
    }, TICK_MS);
  }

  /** Краткое описание результата действия */
  getTaskActionLabel(card: ActionCard): string {
    if (!card.resolution) return "Ожидает действия";

    switch (card.resolution.decision) {
      case "approved":
        return "✅ Обработано";
      case "modified":
        return "✏️ Изменено";
      case "rejected":
        return "❌ Отклонено";
      case "acknowledged":
        return "👁 Принято к сведению";
      default:
        return "Ожидает";
    }
  }
}
