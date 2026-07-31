import { makeAutoObservable, runInAction, observable } from "mobx";
import { Subject } from "rxjs";
import { ActionCard } from "../models/ActionCard";
import { Document } from "../models/Document";
import { CalendarEvent } from "../models/CalendarEvent";
import { AuditEntry } from "./AuditEntry";
import { ServiceContainer } from "../di/Container";
import { uid } from "../services/mock/delay";

export type DomainEvent =
  | { type: "card:resolved"; payload: { cardId: string; card: ActionCard } }
  | { type: "card:added"; payload: { card: ActionCard } }
  | { type: "document:created"; payload: { documentId: string } }
  | { type: "audit:added"; payload: AuditEntry };

export class DomainStore {
  /** Единый источник карточек */
  cards = observable.map<string, ActionCard>();
  /** Единый источник документов */
  documents = observable.map<string, Document>();
  /** Единый источник календарных событий */
  calendarEvents = observable.map<string, CalendarEvent>();
  /** Журнал всех действий */
  auditLog: AuditEntry[] = [];
  /** Поток событий для реактивной подписки */
  changes$ = new Subject<DomainEvent>();

  isLoading = false;
  /** Агент работает (создаёт карточки, анализирует) */
  isAgentWorking = false;
  private services: ServiceContainer;

  constructor(services: ServiceContainer) {
    this.services = services;
    makeAutoObservable(this);
  }

  // ─── Загрузка данных ───────────────────────────────────────

  async loadInitialData() {
    this.isLoading = true;
    try {
      const [events, contractDocs, litigationDocs] = await Promise.all([
        this.services.calendar.getAllEvents(),
        this.services.document.getDocumentsByWorkspace("contracts"),
        this.services.document.getDocumentsByWorkspace("litigation"),
      ]);

      runInAction(() => {
        events.forEach((e) => this.calendarEvents.set(e.id, e));
        [...contractDocs, ...litigationDocs].forEach((d) =>
          this.documents.set(d.id, d)
        );
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /** Добавить карточку (вызывается AgentOrchestrator) */
  addCard(card: ActionCard) {
    this.cards.set(card.id, card);
    this.changes$.next({ type: "card:added", payload: { card } });
  }

  // ─── Мутации ───────────────────────────────────────────────

  resolveCard(
    cardId: string,
    decision: "approved" | "modified" | "rejected" | "acknowledged",
    comment?: string
  ): Promise<ActionCard | null> {
    return new Promise((resolve) => {
      this.services.card.resolveCard(cardId, decision, comment).subscribe({
        next: (updatedCard) => {
          runInAction(() => {
            this.cards.set(cardId, updatedCard);

            const entry: AuditEntry = {
              id: uid("audit"),
              entityType: "card",
              entityId: cardId,
              action: "card:resolved",
              actor: "user",
              summary: `Пользователь ${this.getDecisionLabel(decision)}: ${
                updatedCard.title
              }`,
              workspaceId: updatedCard.workspaceId,
              threadId: updatedCard.threadId,
              relatedIds: { cardId },
              timestamp: new Date().toISOString(),
            };
            this.auditLog.push(entry);
            this.changes$.next({ type: "audit:added", payload: entry });
            this.changes$.next({
              type: "card:resolved",
              payload: { cardId, card: updatedCard },
            });
          });
          resolve(updatedCard);
        },
        error: () => resolve(null),
      });
    });
  }

  addAuditEntry(entry: Omit<AuditEntry, "id" | "timestamp">) {
    runInAction(() => {
      const full: AuditEntry = {
        ...entry,
        id: uid("audit"),
        timestamp: new Date().toISOString(),
      };
      this.auditLog.push(full);
      this.changes$.next({ type: "audit:added", payload: full });
    });
  }

  // ─── Запросы к аудит-логу ──────────────────────────────────

  getAuditForEntity(entityType: string, entityId: string): AuditEntry[] {
    return this.auditLog.filter(
      (e) => e.entityType === entityType && e.entityId === entityId
    );
  }

  getAuditForCard(cardId: string): AuditEntry[] {
    return this.getAuditForEntity("card", cardId);
  }

  getAuditForDocument(docId: string): AuditEntry[] {
    return this.auditLog.filter((e) => e.relatedIds?.documentId === docId);
  }

  get cardList(): ActionCard[] {
    return [...this.cards.values()];
  }

  get documentList(): Document[] {
    return [...this.documents.values()];
  }

  get calendarEventList(): CalendarEvent[] {
    return [...this.calendarEvents.values()];
  }

  private getDecisionLabel(decision: string): string {
    const labels: Record<string, string> = {
      approved: "подтвердил",
      modified: "изменил",
      rejected: "отклонил",
      acknowledged: "принял к сведению",
    };
    return labels[decision] || decision;
  }
}
