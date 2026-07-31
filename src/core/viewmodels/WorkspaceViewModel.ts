import {
  makeObservable,
  observable,
  computed,
  action,
  runInAction,
} from "mobx";
import { BaseViewModel } from "../base/BaseViewModel";
import { DomainStore } from "../domain/DomainStore";
import { CardQueueViewModel } from "./CardQueueViewModel";
import { TaskListViewModel } from "./TaskListViewModel";
import { ChatViewModel } from "./ChatViewModel";
import { WorkspaceConfig } from "../models/Workspace";
import { CalendarEvent } from "../models/CalendarEvent";
import { Document } from "../models/Document";
import { AuditEntry } from "../domain/AuditEntry";
import { Message, Role } from "../models/Message";
import { uid } from "../services/mock/delay";

interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  lastActivity: string;
}

export class WorkspaceViewModel extends BaseViewModel {
  config: WorkspaceConfig;
  chatVM: ChatViewModel;
  cardQueueVM: CardQueueViewModel;
  taskListVM: TaskListViewModel;
  activeTabId: string;
  activeThreadId: string | null = null;
  chatThreads: ChatThread[] = [];
  isLoading = false;

  private domain: DomainStore;

  constructor(
    domain: DomainStore,
    config: WorkspaceConfig,
    cardQueueVM: CardQueueViewModel,
    taskListVM: TaskListViewModel,
    chatVM: ChatViewModel
  ) {
    super(); // subscriptions + dispose
    makeObservable(this, {
      activeTabId: observable,
      activeThreadId: observable,
      chatThreads: observable,
      isLoading: observable,
      calendarEvents: computed,
      documents: computed,
      auditEntries: computed,
      init: action,
      selectTab: action,
      selectThread: action,
      sendMessage: action,
    });
    this.domain = domain;
    this.config = config;
    this.cardQueueVM = cardQueueVM;
    this.taskListVM = taskListVM;
    this.chatVM = chatVM;
    this.activeTabId = config.tabs[0]?.id ?? "";
  }

  get calendarEvents(): CalendarEvent[] {
    let list = this.domain.calendarEventList;

    // Для комбинированного пространства «Мои дела» — все события
    if (this.config.id !== "my-cases") {
      list = list.filter((e) => e.workspaceId === this.config.id);
    }

    // Фильтр по выбранному чату-задаче
    if (this.activeThreadId) {
      list = list.filter(
        (e) => !e.threadId || e.threadId === this.activeThreadId
      );
    }

    // Показываем только события, привязанные к карточкам в очереди или в задачах
    const queueCardIds = new Set(this.cardQueueVM.sortedCards.map((c) => c.id));
    const taskCardIds = new Set(this.taskListVM.tasks.map((c) => c.id));
    const knownCardIds = new Set([...queueCardIds, ...taskCardIds]);

    return list.filter(
      (e) => !e.relatedCardId || knownCardIds.has(e.relatedCardId)
    );
  }

  get documents(): Document[] {
    // Для комбинированного пространства «Мои дела» — все документы
    if (this.config.id === "my-cases") {
      return this.domain.documentList;
    }
    return this.domain.documentList.filter(
      (d) => d.workspaceId === this.config.id
    );
  }

  get auditEntries(): AuditEntry[] {
    // Записи аудита для выбранного чата-задачи
    if (!this.activeThreadId) return [];
    return this.domain.auditLog.filter(
      (e) => e.threadId === this.activeThreadId
    );
  }

  async init() {
    this.isLoading = true;
    // Фильтруем карточки по типам, определённым в конфиге продукта
    this.cardQueueVM.setCardTypeFilter(this.config.cardTypes);
    await this.loadChatThreads();
    runInAction(() => {
      this.isLoading = false;
      if (this.chatThreads.length > 0) {
        this.selectThread(this.chatThreads[0].id);
        // Добавляю демо-записи аудита
        this.loadDemoAuditEntries();
      }
    });
  }

  private loadDemoAuditEntries() {
    const entries = [
      {
        entityType: "document" as const,
        entityId: "doc-4",
        action: "document:created" as const,
        actor: "agent" as const,
        summary: "Создано дело №А40-12345/2025",
        workspaceId: "litigation",
        threadId: "thread-l1",
        relatedIds: { documentId: "doc-4" },
      },
      {
        entityType: "card" as const,
        entityId: "card-1",
        action: "card:created" as const,
        actor: "agent" as const,
        summary: "Агент создал карточку: Срок подачи апелляционной жалобы",
        workspaceId: "litigation",
        threadId: "thread-l1",
        relatedIds: { cardId: "card-1" },
      },
      {
        entityType: "card" as const,
        entityId: "card-2",
        action: "card:created" as const,
        actor: "agent" as const,
        summary: "Агент создал карточку: Оплата госпошлины",
        workspaceId: "litigation",
        threadId: "thread-l1",
        relatedIds: { cardId: "card-2" },
      },
      {
        entityType: "document" as const,
        entityId: "doc-1",
        action: "document:created" as const,
        actor: "agent" as const,
        summary: "Создан договор ДП-2024-0156",
        workspaceId: "contracts",
        threadId: "thread-c1",
        relatedIds: { documentId: "doc-1" },
      },
      {
        entityType: "card" as const,
        entityId: "card-3",
        action: "card:created" as const,
        actor: "agent" as const,
        summary: "Агент создал карточку: Согласование допсоглашения",
        workspaceId: "contracts",
        threadId: "thread-c1",
        relatedIds: { cardId: "card-3" },
      },
      {
        entityType: "card" as const,
        entityId: "card-4",
        action: "card:created" as const,
        actor: "agent" as const,
        summary: "Агент создал карточку: Ответ на претензию",
        workspaceId: "contracts",
        threadId: "thread-c2",
        relatedIds: { cardId: "card-4" },
      },
    ];

    entries.forEach((e) => {
      this.domain.addAuditEntry(e);
    });
  }

  private async loadChatThreads() {
    // Демо-данные чатов-задач
    const contractThreads: ChatThread[] = [
      {
        id: "thread-c1",
        title: "Допсоглашение с ТехноСнаб",
        lastActivity: "2026-07-28T09:15:00Z",
        messages: [
          {
            id: uid("msg"),
            role: Role.Agent,
            content:
              "Контрагент прислал проект допсоглашения об изменении срока оплаты с 30 до 45 дней. Проверил условия — изменение ухудшает нашу позицию.",
            timestamp: "2026-07-28T09:00:00Z",
          },
          {
            id: uid("msg"),
            role: Role.Agent,
            content:
              "Рекомендую предложить контр-условие: 45 дней, но с правом досрочного погашения со скидкой 2%. Подготовил проект ответа.",
            timestamp: "2026-07-28T09:15:00Z",
            sourceRefs: [
              {
                type: "document" as const,
                targetId: "doc-2",
                title: "Дополнительное соглашение №1",
                section: "Изменение условий",
              },
            ],
          },
        ],
      },
      {
        id: "thread-c2",
        title: "Претензия ТехноСнаб",
        lastActivity: "2026-07-27T16:00:00Z",
        messages: [
          {
            id: uid("msg"),
            role: Role.Agent,
            content:
              'ООО "ТехноСнаб" направило претензию о просрочке оплаты по договору ДП-2024-0156. Срок ответа — 30.07.2026.',
            timestamp: "2026-07-27T15:00:00Z",
          },
        ],
      },
      {
        id: "thread-c3",
        title: "Продление аренды",
        lastActivity: "2026-07-26T11:00:00Z",
        messages: [
          {
            id: uid("msg"),
            role: Role.Agent,
            content:
              "Договор аренды №А-2024-0089 истекает 31.07.2026. Требуется уведомить арендодателя.",
            timestamp: "2026-07-26T11:00:00Z",
          },
        ],
      },
    ];

    const litigationThreads: ChatThread[] = [
      {
        id: "thread-l1",
        title: "Дело №А40-12345/2025",
        lastActivity: "2026-07-28T08:30:00Z",
        messages: [
          {
            id: uid("msg"),
            role: Role.Agent,
            content:
              'Дело №А40-12345/2025. Истец: ООО "ТехноСнаб". Предмет: взыскание задолженности 2 500 000 руб. и неустойки.',
            timestamp: "2026-07-28T08:00:00Z",
          },
          {
            id: uid("msg"),
            role: Role.Agent,
            content:
              "Сегодня истекает срок подачи апелляционной жалобы. Жалоба подготовлена на основании решения суда от 14.07.2026.",
            timestamp: "2026-07-28T08:30:00Z",
            sourceRefs: [
              {
                type: "document" as const,
                targetId: "doc-4",
                title: "Исковое заявление",
                section: "Обстоятельства дела",
              },
            ],
          },
        ],
      },
      {
        id: "thread-l2",
        title: "Проверка расчёта неустойки",
        lastActivity: "2026-07-27T14:00:00Z",
        messages: [
          {
            id: uid("msg"),
            role: Role.Agent,
            content:
              "Истец заявил неустойку 1 687 500 руб., но не учёл частичную оплату. Корректная сумма: ~1 200 000 руб. Рекомендую заявить о снижении по ст. 333 ГК РФ.",
            timestamp: "2026-07-27T14:00:00Z",
            sourceRefs: [
              {
                type: "document" as const,
                targetId: "doc-4",
                title: "Исковое заявление",
                section: "Расчет неустойки",
              },
            ],
          },
        ],
      },
    ];

    const threads: ChatThread[] =
      this.config.id === "my-cases"
        ? [...contractThreads, ...litigationThreads]
        : this.config.id === "contracts"
          ? contractThreads
          : litigationThreads;

    runInAction(() => {
      this.chatThreads = threads;
    });
  }

  selectTab(tabId: string) {
    this.activeTabId = tabId;
  }

  selectThread(threadId: string) {
    this.activeThreadId = threadId;
    // Фильтруем карточки только для выбранного чата-задачи
    this.cardQueueVM.setThreadFilter(threadId);
    const thread = this.chatThreads.find((t) => t.id === threadId);
    if (thread) {
      this.chatVM.clearMessages();
      thread.messages.forEach((m) => this.chatVM.messages.push(m));
    }
  }

  sendMessage(text: string) {
    if (!this.activeThreadId) return;
    this.chatVM.sendMessage(text);
    // Обновляем lastActivity
    const thread = this.chatThreads.find((t) => t.id === this.activeThreadId);
    if (thread) {
      thread.lastActivity = new Date().toISOString();
    }
  }
}
