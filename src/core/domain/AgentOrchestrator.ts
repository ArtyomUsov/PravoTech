import { DomainStore } from "./DomainStore";
import { ChatViewModel } from "../viewmodels/ChatViewModel";
import { ActionCard, CardStatus } from "../models/ActionCard";
import { CardType } from "../models/ActionCard";
import { Priority } from "../models/Priority";
import { actionCards } from "../services/mock/data";
import { runInAction } from "mobx";

/** Задержка между появлением карточек в зависимости от приоритета */
const CARD_DELAYS: Record<string, number> = {
  P0: 1200,
  P1: 2400,
  P2: 3200,
  P3: 4000,
};

/** Пауза перед первой карточкой — агент "анализирует документы" */
const INITIAL_DELAY = 1000;

export class AgentOrchestrator {
  private domain: DomainStore;
  private chatVM: ChatViewModel;

  constructor(domain: DomainStore, chatVM: ChatViewModel) {
    this.domain = domain;
    this.chatVM = chatVM;
  }

  async runStartup(): Promise<void> {
    runInAction(() => {
      this.domain.isAgentWorking = true;
    });

    // Сортируем карточки: P0 → P1 → P2 → P3
    const sorted = [...actionCards]
      .filter((c) => c.status === CardStatus.Pending)
      .sort(
        (a, b) =>
          this.priorityOrder(a.priority) - this.priorityOrder(b.priority)
      );

    if (sorted.length === 0) {
      this.streamDigest([]);
      runInAction(() => {
        this.domain.isAgentWorking = false;
      });
      return;
    }

    // Стримим дайджест
    this.streamDigest(sorted);

    // Создаём карточки по одной с задержкой
    await this.createCardsProgressively(sorted);

    runInAction(() => {
      this.domain.isAgentWorking = false;
    });
  }

  private async createCardsProgressively(cards: ActionCard[]): Promise<void> {
    // Пауза перед первой карточкой — агент "анализирует"
    await this.delay(INITIAL_DELAY);

    for (const card of cards) {
      // Добавляем карточку в правую панель
      this.domain.addCard(card);

      // Добавляем карточку — DigestText покажет inline-стрелку после строки
      this.chatVM.addDigestCard(card);

      const delay = CARD_DELAYS[card.priority] || 1000;
      await this.delay(delay);
    }
  }

  private streamDigest(cards: ActionCard[]) {
    const p0 = cards.filter((c) => c.priority === Priority.P0);
    const p1 = cards.filter((c) => c.priority === Priority.P1);
    const p2 = cards.filter((c) => c.priority === Priority.P2);

    const today = new Date().toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let text = `На данный момент: ${p0.length} карточек P0 и ${p1.length} карточек P1 требуют вашего внимания.\n\nСегодня: ${today}\n\n`;

    if (p0.length > 0) {
      text += "🔴 Критические (P0):\n";
      p0.forEach((c) => {
        text += `  • ${c.title}`;
        if (c.deadline)
          text += ` — срок: ${new Date(c.deadline).toLocaleDateString(
            "ru-RU"
          )}`;
        text += "\n";
      });
      text += "\n";
    }

    if (p1.length > 0) {
      text += "🟠 Срочные (P1):\n";
      p1.forEach((c) => {
        text += `  • ${c.title}`;
        if (c.deadline)
          text += ` — срок: ${new Date(c.deadline).toLocaleDateString(
            "ru-RU"
          )}`;
        text += "\n";
      });
      text += "\n";
    }

    if (p2.length > 0) {
      text += "🔵 Плановые (P2):\n";
      p2.forEach((c) => {
        text += `  • ${c.title}\n`;
      });
      text += "\n";
    }

    // Календарь на сегодня
    const todayEvents = this.domain.calendarEventList.filter(
      (e) => e.date === new Date().toISOString().split("T")[0]
    );
    if (todayEvents.length > 0) {
      text += "📅 Сегодня в календаре:\n";
      todayEvents.forEach((e) => {
        text += `  • ${e.title}\n`;
      });
      text += "\n";
    }

    text +=
      "Рекомендую начать с карточек P0 — по каждой подготовлены проекты документов. Задайте вопрос в чате, если нужны подробности.";

    const cardsByPriority: Record<string, ActionCard[]> = {
      P0: p0,
      P1: p1,
      P2: p2,
    };

    this.chatVM.streamDigestWithCards(text, cardsByPriority);
  }

  private priorityOrder(priority: Priority): number {
    const order: Record<string, number> = {
      P0: 0,
      P1: 1,
      P2: 2,
      P3: 3,
    };
    return order[priority] ?? 99;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
