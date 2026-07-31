import { ActionCard, CardType, CardStatus } from "../../models/ActionCard";
import { Message, Role } from "../../models/Message";
import { Document, DocumentSection } from "../../models/Document";
import { CalendarEvent } from "../../models/CalendarEvent";
import { Priority } from "../../models/Priority";
import { WorkspaceConfig } from "../../models/Workspace";

// ─── Документы ───────────────────────────────────────────────

export const contracts: Document[] = [
  {
    id: "doc-1",
    title: "Договор поставки №ДП-2024-0156",
    type: "contract",
    workspaceId: "contracts",
    content:
      'Договор поставки между ООО "ТехноСнаб" и ООО "Юридическая фирма "Правовой Стандарт"',
    sections: [
      {
        id: "sec-1-1",
        title: "Предмет договора",
        content:
          "1.1. Поставщик обязуется передать, а Покупатель принять и оплатить товар в ассортименте, количестве и сроки, предусмотренные Спецификациями, являющимися неотъемлемой частью настоящего Договора.\n1.2. Наименование, ассортимент, количество, цена, срок и условия поставки товара согласовываются сторонами в Спецификациях.",
      },
      {
        id: "sec-1-2",
        title: "Цена и порядок расчетов",
        content:
          "2.1. Цена товара устанавливается в Спецификациях и включает НДС.\n2.2. Оплата производится в течение 30 (тридцати) календарных дней с даты поставки товара.\n2.3. При просрочке оплаты более чем на 10 дней Поставщик вправе требовать уплаты неустойки в размере 0.1% от суммы задолженности за каждый день просрочки.",
      },
      {
        id: "sec-1-3",
        title: "Ответственность сторон",
        content:
          "3.1. За нарушение сроков поставки Поставщик уплачивает пеню в размере 0.1% от стоимости непоставленного товара за каждый день просрочки, но не более 10% от стоимости товара.\n3.2. За нарушение сроков оплаты Покупатель уплачивает неустойку в размере 0.5% от суммы задолженности за каждый день просрочки.",
      },
      {
        id: "sec-1-4",
        title: "Срок действия",
        content:
          "4.1. Договор вступает в силу с момента подписания и действует до 31.12.2025.\n4.2. Если ни одна из сторон не заявит о расторжении за 30 дней до окончания срока, договор автоматически продлевается на каждый следующий календарный год.",
      },
    ],
    metadata: {
      number: "ДП-2024-0156",
      date: "15.01.2024",
      counterparty: 'ООО "ТехноСнаб"',
      status: "действует",
    },
  },
  {
    id: "doc-2",
    title: "Дополнительное соглашение №1 к ДП-2024-0156",
    type: "appendix",
    workspaceId: "contracts",
    content: "Дополнительное соглашение об изменении условий оплаты",
    sections: [
      {
        id: "sec-2-1",
        title: "Изменение условий",
        content:
          '1. Внести изменения в п. 2.2 Договора, изложив его в следующей редакции:\n"Оплата производится в течение 45 (сорока пяти) календарных дней с даты поставки товара."\n2. Настоящее Соглашение вступает в силу с момента подписания.',
      },
    ],
    metadata: { number: "1", date: "10.06.2024", mainContract: "ДП-2024-0156" },
  },
  {
    id: "doc-3",
    title: "Договор аренды №А-2024-0089",
    type: "contract",
    workspaceId: "contracts",
    content: "Договор аренды нежилого помещения",
    sections: [
      {
        id: "sec-3-1",
        title: "Предмет договора",
        content:
          "1.1. Арендодатель передает, а Арендатор принимает во временное владение и пользование нежилое помещение общей площадью 50 кв.м., расположенное по адресу: г. Москва, ул. Тверская, д. 15, оф. 302.",
      },
      {
        id: "sec-3-2",
        title: "Арендная плата",
        content:
          "2.1. Арендная плата составляет 120 000 рублей в месяц, включая НДС.\n2.2. Оплата производится ежемесячно не позднее 5-го числа текущего месяца.\n2.3. Арендодатель вправе увеличивать арендную плату не чаще одного раза в год, но не более чем на 10%.",
      },
    ],
    metadata: {
      number: "А-2024-0089",
      date: "01.03.2024",
      counterparty: "ИП Смирнов А.В.",
      status: "действует",
    },
  },
  {
    id: "doc-4",
    title: "Исковое заявление о взыскании задолженности",
    type: "court_doc",
    workspaceId: "litigation",
    content: "Исковое заявление в Арбитражный суд г. Москвы",
    sections: [
      {
        id: "sec-4-1",
        title: "Обстоятельства дела",
        content:
          "Между Истцом и Ответчиком заключен Договор поставки №ДП-2024-0156, в соответствии с которым Истец поставил товар на сумму 2 500 000 рублей.\nОтветчик оплату не произвел, задолженность составляет 2 500 000 рублей.",
      },
      {
        id: "sec-4-2",
        title: "Расчет неустойки",
        content:
          "Согласно п. 3.2 Договора, неустойка за просрочку оплаты составляет 0,5% за каждый день просрочки.\nЗа период с 01.02.2025 по 15.06.2025 (135 дней) неустойка составляет: 2 500 000 × 0,5% × 135 = 1 687 500 рублей.\nИстец полагает возможным снизить неустойку до 500 000 рублей на основании ст. 333 ГК РФ.",
      },
    ],
    metadata: {
      caseNumber: "А40-12345/2025",
      court: "Арбитражный суд г. Москвы",
      plaintiff: 'ООО "ТехноСнаб"',
      defendant: 'ООО "Юридическая фирма "Правовой Стандарт"',
      status: "подано",
    },
  },
  {
    id: "doc-5",
    title: "Отзыв на исковое заявление",
    type: "court_doc",
    workspaceId: "litigation",
    content: "Отзыв на исковое заявление о взыскании задолженности",
    sections: [
      {
        id: "sec-5-1",
        title: "Возражения",
        content:
          "1. Истец неверно рассчитал сумму основного долга: часть товара была возвращена по акту №В-15 от 20.03.2025 на сумму 450 000 рублей.\n2. Заявленная неустойка явно несоразмерна последствиям нарушения обязательства и подлежит снижению.",
      },
    ],
    metadata: { caseNumber: "А40-12345/2025", status: "черновик" },
  },
];

export const contractDocuments: Document[] = contracts.filter(
  (d) => d.workspaceId === "contracts"
);
export const litigationDocuments: Document[] = contracts.filter(
  (d) => d.workspaceId === "litigation"
);

// ─── Карточки действий ───────────────────────────────────────

export const actionCards: ActionCard[] = [
  {
    id: "card-1",
    type: CardType.Deadline,
    priority: Priority.P0,
    status: CardStatus.Pending,
    workspaceId: "litigation",
    threadId: "thread-l1",
    title: "Срок подачи апелляционной жалобы истекает сегодня",
    description:
      "По делу №А40-12345/2025 срок подачи апелляционной жалобы истекает 28.07.2026.",
    agentNote:
      "Апелляционная жалоба подготовлена на основании решения суда от 14.07.2026. Требуется ваше подтверждение для отправки.",
    createdAt: "2026-07-28T08:00:00Z",
    deadline: "2026-07-28T23:59:00Z",
    context: {
      caseNumber: "А40-12345/2025",
      document: "Исковое заявление",
      deadline: "28.07.2026",
    },
    sourceRefs: [
      {
        type: "document" as const,
        targetId: "doc-4",
        title: "Исковое заявление о взыскании задолженности",
        section: "Обстоятельства дела",
      },
    ],
  },
  {
    id: "card-2",
    type: CardType.Payment,
    priority: Priority.P0,
    status: CardStatus.Pending,
    workspaceId: "litigation",
    threadId: "thread-l1",
    title: "Оплата госпошлины за подачу иска",
    description:
      "Требуется оплатить госпошлину в размере 35 000 рублей по делу №А40-12345/2025.",
    agentNote: "Реквизиты проверены по квитанции суда. Срок оплаты — сегодня.",
    createdAt: "2026-07-28T07:30:00Z",
    deadline: "2026-07-28T23:59:00Z",
    context: {
      amount: "35 000 ₽",
      recipient: "УФК по г. Москве (Арбитражный суд г. Москвы)",
      kbk: "18210801000011000110",
    },
    sourceRefs: [
      {
        type: "document" as const,
        targetId: "doc-4",
        title: "Исковое заявление о взыскании задолженности",
      },
    ],
  },
  {
    id: "card-3",
    type: CardType.Approval,
    priority: Priority.P0,
    status: CardStatus.Pending,
    workspaceId: "contracts",
    threadId: "thread-c1",
    title: "Согласовать дополнительное соглашение №1",
    description:
      "Контрагент прислал проект допсоглашения об изменении условий оплаты с 30 до 45 дней.",
    agentNote:
      "Проверил условия. Изменение срока оплаты с 30 до 45 дней ухудшает наше положение. Рекомендую предложить контр-условие: 45 дней, но с правом досрочного погашения со скидкой 2%.",
    createdAt: "2026-07-28T06:00:00Z",
    context: {
      contract: "ДП-2024-0156",
      counterparty: 'ООО "ТехноСнаб"',
      current: "30 дней",
      proposed: "45 дней",
    },
    sourceRefs: [
      {
        type: "document" as const,
        targetId: "doc-1",
        title: "Договор поставки №ДП-2024-0156",
        section: "Цена и порядок расчетов",
      },
      {
        type: "document" as const,
        targetId: "doc-2",
        title: "Дополнительное соглашение №1 к ДП-2024-0156",
      },
    ],
  },
  {
    id: "card-4",
    type: CardType.Deadline,
    priority: Priority.P1,
    status: CardStatus.Pending,
    workspaceId: "contracts",
    threadId: "thread-c2",
    title: "Срок ответа на претензию истекает через 2 дня",
    description:
      'ООО "ТехноСнаб" направило претензию о просрочке оплаты по договору ДП-2024-0156.',
    agentNote:
      "Проект ответа на претензию подготовлен. Основной аргумент: товар поставлен с нарушением ассортимента, что подтверждается актом приема-передачи.",
    createdAt: "2026-07-28T10:00:00Z",
    deadline: "2026-07-30T18:00:00Z",
    context: {
      contract: "ДП-2024-0156",
      counterparty: 'ООО "ТехноСнаб"',
      type: "Претензия по оплате",
    },
    sourceRefs: [
      {
        type: "document" as const,
        targetId: "doc-1",
        title: "Договор поставки №ДП-2024-0156",
        section: "Ответственность сторон",
      },
    ],
  },
  {
    id: "card-5",
    type: CardType.Notification,
    priority: Priority.P1,
    status: CardStatus.Pending,
    workspaceId: "contracts",
    threadId: "thread-c3",
    title: "Направить уведомление о продлении договора аренды",
    description:
      "Договор аренды №А-2024-0089 истекает 31.07.2026. Требуется уведомить арендодателя о намерении продлить.",
    agentNote:
      "Уведомление подготовлено на основании п. 4.2 договора. Срок направления — до 31.07.2026.",
    createdAt: "2026-07-28T09:00:00Z",
    deadline: "2026-07-31T18:00:00Z",
    context: {
      contract: "А-2024-0089",
      counterparty: "ИП Смирнов А.В.",
      action: "Продление договора",
    },
    sourceRefs: [
      {
        type: "document" as const,
        targetId: "doc-3",
        title: "Договор аренды №А-2024-0089",
        section: "Предмет договора",
      },
    ],
  },
  {
    id: "card-6",
    type: CardType.Review,
    priority: Priority.P2,
    status: CardStatus.Pending,
    workspaceId: "contracts",
    threadId: "thread-c1",
    title: "Штрафная неустойка 0.5% — выше рыночной",
    description:
      "В договоре ДП-2024-0156 п. 3.2 предусмотрена неустойка 0.5% за день просрочки оплаты.",
    agentNote:
      "Рыночная норма для аналогичных договоров: 0.1-0.2%. Рекомендую инициировать переговоры о снижении ставки. При текущей ставке за 30 дней просрочки неустойка составит 15% от суммы.",
    createdAt: "2026-07-27T14:00:00Z",
    context: {
      contract: "ДП-2024-0156",
      currentRate: "0.5%",
      marketRate: "0.1-0.2%",
      risk: "Высокий",
    },
    sourceRefs: [
      {
        type: "document" as const,
        targetId: "doc-1",
        title: "Договор поставки №ДП-2024-0156",
        section: "Ответственность сторон",
      },
    ],
  },
  {
    id: "card-7",
    type: CardType.Review,
    priority: Priority.P2,
    status: CardStatus.Pending,
    workspaceId: "litigation",
    threadId: "thread-l2",
    title: "Необходимо проверить расчет неустойки истца",
    description:
      "По делу №А40-12345/2025 истец заявил неустойку 1 687 500 рублей.",
    agentNote:
      "Истец не учел частичную оплату на 450 000 рублей. Корректная сумма неустойки: ~1 200 000 рублей. Рекомендую заявить о снижении по ст. 333 ГК РФ.",
    createdAt: "2026-07-27T11:00:00Z",
    context: {
      caseNumber: "А40-12345/2025",
      claimed: "1 687 500 ₽",
      estimated: "~1 200 000 ₽",
      recommendation: "Снизить по ст. 333 ГК РФ",
    },
    sourceRefs: [
      {
        type: "document" as const,
        targetId: "doc-4",
        title: "Исковое заявление о взыскании задолженности",
        section: "Расчет неустойки",
      },
    ],
  },
  {
    id: "card-8",
    type: CardType.Notification,
    priority: Priority.P3,
    status: CardStatus.Pending,
    workspaceId: "litigation",
    title: "Уведомить контрагента о смене юр. адреса",
    description: "С 01.08.2026 изменяется юридический адрес компании.",
    agentNote:
      'Подготовил уведомление для всех контрагентов. Список: ООО "ТехноСнаб", ИП Смирнов А.В.',
    createdAt: "2026-07-26T10:00:00Z",
    deadline: "2026-08-01T00:00:00Z",
    context: {
      change: "Юридический адрес",
      newAddress: "г. Москва, ул. Новый Арбат, д. 10",
      effectiveDate: "01.08.2026",
    },
    sourceRefs: [],
  },
];

export const contractCards: ActionCard[] = actionCards.filter(
  (c) => c.workspaceId === "contracts"
);
export const litigationCards: ActionCard[] = actionCards.filter(
  (c) => c.workspaceId === "litigation"
);

// ─── Сообщения чата ──────────────────────────────────────────

export const todayChatMessages: Message[] = [
  {
    id: "msg-0",
    role: Role.System,
    content:
      "На данный момент: 2 карточки P0 и 2 карточки P1 требуют вашего внимания.\n\n• **Срок подачи апелляционной жалобы** истекает сегодня (P0) — по делу №А40-12345/2025\n• **Оплата госпошлины** 35 000 ₽ — сегодня (P0)\n• **Согласование допсоглашения** по договору ДП-2024-0156 (P0)\n• **Срок ответа на претензию** истекает через 2 дня (P1)\n\nРекомендую начать с карточек P0 — по каждой подготовлены проекты документов.",
    timestamp: "2026-07-28T09:00:00Z",
  },
];

export const contractsChatMessages: Message[] = [
  {
    id: "msg-c1",
    role: Role.System,
    content:
      'Добрый день! В пространстве «Договоры» 4 активные карточки. По договору ДП-2024-0156 с ООО "ТехноСнаб" требуется согласование допсоглашения и подготовка ответа на претензию.',
    timestamp: "2026-07-28T09:00:00Z",
  },
];

export const litigationChatMessages: Message[] = [
  {
    id: "msg-l1",
    role: Role.System,
    content:
      "Добрый день! В пространстве «Судебные дела» по делу №А40-12345/2025: сегодня истекает срок подачи апелляционной жалобы, требуется оплата госпошлины.",
    timestamp: "2026-07-28T09:00:00Z",
  },
];

// ─── События календаря ───────────────────────────────────────

export const calendarEvents: CalendarEvent[] = [
  {
    id: "cal-1",
    title: "Срок подачи апелляционной жалобы",
    date: "2026-07-28",
    type: "deadline",
    workspaceId: "litigation",
    threadId: "thread-l1",
    priority: "high",
    completed: false,
    relatedCardId: "card-1",
    relatedDocumentId: "doc-4",
  },
  {
    id: "cal-2",
    title: "Оплата госпошлины",
    date: "2026-07-28",
    type: "deadline",
    workspaceId: "litigation",
    threadId: "thread-l1",
    priority: "high",
    completed: false,
    relatedCardId: "card-2",
  },
  {
    id: "cal-3",
    title: "Согласование допсоглашения",
    date: "2026-07-28",
    type: "deadline",
    workspaceId: "contracts",
    threadId: "thread-c1",
    priority: "high",
    completed: false,
    relatedCardId: "card-3",
  },
  {
    id: "cal-4",
    title: "Срок ответа на претензию",
    date: "2026-07-30",
    type: "deadline",
    workspaceId: "contracts",
    threadId: "thread-c2",
    priority: "medium",
    completed: false,
    relatedCardId: "card-4",
  },
  {
    id: "cal-5",
    title: "Уведомление о продлении аренды",
    date: "2026-07-31",
    type: "reminder",
    workspaceId: "contracts",
    threadId: "thread-c3",
    priority: "medium",
    completed: false,
    relatedCardId: "card-5",
  },
  {
    id: "cal-6",
    title: "Судебное заседание по делу №А40-12345/2025",
    date: "2026-08-05",
    type: "hearing",
    workspaceId: "litigation",
    threadId: "thread-l1",
    priority: "high",
    completed: false,
    relatedDocumentId: "doc-4",
  },
  {
    id: "cal-7",
    title: "Смена юридического адреса",
    date: "2026-08-01",
    type: "reminder",
    workspaceId: "litigation",
    priority: "low",
    completed: false,
    relatedCardId: "card-8",
  },
];

export const contractCalendarEvents: CalendarEvent[] = calendarEvents.filter(
  (e) => e.workspaceId === "contracts"
);
export const litigationCalendarEvents: CalendarEvent[] = calendarEvents.filter(
  (e) => e.workspaceId === "litigation"
);

// ─── Конфигурации пространств ────────────────────────────────

export const contractsConfig: WorkspaceConfig = {
  id: "contracts",
  title: "Договоры",
  icon: "Description",
  tabs: [
    { id: "contracts", label: "Договоры", type: "document-list" },
    { id: "events", label: "События", type: "event-list" },
    { id: "docs", label: "Документы", type: "document-list" },
  ],
  cardTypes: ["approval", "payment", "notification", "review"],
  agentSkills: ["contract-analysis", "deadline-control", "preparation"],
};

export const litigationConfig: WorkspaceConfig = {
  id: "litigation",
  title: "Судебные дела",
  icon: "Gavel",
  tabs: [
    { id: "cases", label: "Дела", type: "document-list" },
    { id: "events", label: "События", type: "event-list" },
    { id: "docs", label: "Документы", type: "document-list" },
  ],
  cardTypes: ["deadline", "payment", "notification", "review"],
  agentSkills: [
    "deadline-control",
    "document-preparation",
    "practice-analysis",
  ],
};

export const workspaceConfigs = [contractsConfig, litigationConfig];

// ─── Комбинированное пространство «Мои дела» ────────────────

export const myCasesConfig: WorkspaceConfig = {
  id: "my-cases",
  title: "Мои дела",
  icon: "Folder",
  tabs: [
    { id: "chat", label: "Чат", type: "chat-list" },
    {
      id: "litigation",
      label: "Суд. дела",
      type: "document-list",
      workspaceFilter: "litigation",
    },
    { id: "events", label: "События", type: "event-list" },
    { id: "docs", label: "Документы", type: "document-list" },
  ],
  cardTypes: ["approval", "deadline", "payment", "notification", "review"],
  agentSkills: [
    "contract-analysis",
    "deadline-control",
    "preparation",
    "document-preparation",
    "practice-analysis",
  ],
};

// ─── Агент-ответы (мок) ──────────────────────────────────────

export const agentReplies: Record<string, string> = {
  Здравствуйте:
    "Здравствуйте! Чем могу помочь? На сегодня у вас 2 критических срока и 2 срочных задачи. Посмотрите карточки справа.",
  "Какие документы требуют внимания":
    'Требуют внимания:\n1. Дополнительное соглашение №1 к ДП-2024-0156 — ожидает согласования\n2. Ответ на претензию ООО "ТехноСнаб" — проект готов, нужна проверка\n3. Апелляционная жалоба по делу №А40-12345/2025 — подготовлена, ожидает подписания',
  "расскажи о деле А40-12345":
    'Дело №А40-12345/2025. Истец: ООО "ТехноСнаб" (поставщик). Предмет: взыскание задолженности по договору ДП-2024-0156 в размере 2 500 000 руб. и неустойки.\n\nТекущая стадия: подано исковое заявление.\nБлижайшие действия:\n• Сегодня — срок подачи апелляционной жалобы\n• 05.08.2026 — судебное заседание\n\nКлючевой риск: неустойка 0.5% в день может быть снижена судом по ст. 333 ГК РФ.',
  "что по договору ДП-2024-0156":
    'Договор поставки №ДП-2024-0156 с ООО "ТехноСнаб".\n\nСтатус: действует до 31.12.2025.\n\nТекущие вопросы:\n1. Допсоглашение №1 — изменение срока оплаты с 30 до 45 дней. Требует согласования.\n2. Претензия от контрагента по просрочке оплаты — срок ответа до 30.07.2026.\n\nРиски: пункт 3.2 — неустойка 0.5%/день при просрочке оплаты (выше рыночной).',
  привет:
    "Привет! Чем могу помочь? У вас несколько задач на сегодня, посмотрите правую панель.",
};

export function findAgentReply(userMessage: string): string {
  const normalized = userMessage.toLowerCase().trim();
  for (const [key, value] of Object.entries(agentReplies)) {
    if (normalized.includes(key.toLowerCase())) {
      return value;
    }
  }
  return "Я понял ваш запрос. Проанализирую информацию и подготовлю ответ. Пока можете посмотреть карточки действий справа — там самые актуальные задачи на сегодня.";
}
