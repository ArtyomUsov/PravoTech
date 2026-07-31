import {
  makeObservable,
  observable,
  computed,
  action,
  runInAction,
} from "mobx";
import { BaseViewModel } from "../base/BaseViewModel";
import { DomainStore } from "../domain/DomainStore";
import { ActionCard, CardStatus } from "../models/ActionCard";
import { PRIORITY_ORDER } from "../models/Priority";

export class CardQueueViewModel extends BaseViewModel {
  expandedCardId: string | null = null;
  resolvingCardIds: Set<string> = new Set();
  isLoading = false;
  threadFilter: string | null = null;
  cardTypeFilter: string[] | null = null;
  private domain: DomainStore;

  constructor(domain: DomainStore) {
    super(); // subscriptions + dispose
    makeObservable(this, {
      expandedCardId: observable,
      resolvingCardIds: observable,
      isLoading: observable,
      threadFilter: observable,
      cardTypeFilter: observable,
      cards: computed,
      sortedCards: computed,
      pendingCount: computed,
      p0Count: computed,
      p1Count: computed,
      selectedCard: computed,
      isAgentWorking: computed,
      loadCards: action,
      setExpandedCardId: action,
      setThreadFilter: action,
      setCardTypeFilter: action,
      resolveCard: action,
    });
    this.domain = domain;
  }

  get cards(): ActionCard[] {
    return this.domain.cardList;
  }

  get sortedCards(): ActionCard[] {
    let list = this.cards.filter((c) => c.status === CardStatus.Pending);

    // Фильтрация по thread (для Workspace — только карточки выбранного чата-задачи)
    if (this.threadFilter !== null) {
      list = list.filter((c) => c.threadId === this.threadFilter);
    }

    // Фильтрация по типам карточек (из WorkspaceConfig.cardTypes)
    if (this.cardTypeFilter !== null) {
      list = list.filter((c) => this.cardTypeFilter!.includes(c.type));
    }

    return [...list].sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    );
  }

  get pendingCount(): number {
    return this.sortedCards.length;
  }

  get p0Count(): number {
    return this.sortedCards.filter((c) => c.priority === "P0").length;
  }

  get p1Count(): number {
    return this.sortedCards.filter((c) => c.priority === "P1").length;
  }

  get selectedCard(): ActionCard | undefined {
    return this.cards.find((c) => c.id === this.expandedCardId);
  }

  /** Агент ещё работает (создаёт карточки) */
  get isAgentWorking(): boolean {
    return this.domain.isAgentWorking;
  }

  async loadCards(workspaceId?: string) {
    this.isLoading = true;
    runInAction(() => {
      this.isLoading = false;
    });
  }

  setExpandedCardId(cardId: string | null) {
    this.expandedCardId = cardId;
  }

  setThreadFilter(threadId: string | null) {
    this.threadFilter = threadId;
    this.expandedCardId = null;
  }

  setCardTypeFilter(types: string[] | null) {
    this.cardTypeFilter = types;
  }

  resolveCard(
    cardId: string,
    decision: "approved" | "modified" | "rejected" | "acknowledged",
    comment?: string
  ): Promise<ActionCard | null> {
    this.resolvingCardIds = new Set([...this.resolvingCardIds, cardId]);

    return this.domain
      .resolveCard(cardId, decision, comment)
      .then((updatedCard) => {
        runInAction(() => {
          this.expandedCardId = null;
          const newSet = new Set(this.resolvingCardIds);
          newSet.delete(cardId);
          this.resolvingCardIds = newSet;
        });
        return updatedCard;
      });
  }

  isResolving(cardId: string): boolean {
    return this.resolvingCardIds.has(cardId);
  }
}
