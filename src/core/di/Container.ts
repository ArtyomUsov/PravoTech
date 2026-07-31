import { AgentService } from '../services/AgentService'
import { CardService } from '../services/CardService'
import { DocumentService } from '../services/DocumentService'
import { CalendarService } from '../services/CalendarService'
import { DomainStore } from '../domain/DomainStore'
import { CardQueueViewModel } from '../viewmodels/CardQueueViewModel'
import { ChatViewModel } from '../viewmodels/ChatViewModel'
import { TodayViewModel } from '../viewmodels/TodayViewModel'
import { WorkspaceViewModel } from '../viewmodels/WorkspaceViewModel'
import { Message } from '../models/Message'
import { WorkspaceConfig } from '../models/Workspace'

/**
 * Type-safe DI container — no decorators, no magic strings.
 *
 * Services are singletons (created once, shared everywhere).
 * ViewModels are created via factory methods (transient — new instance each call).
 *
 * For tests use createTestContainer() with overrides.
 */

export interface ServiceContainer {
  agent: AgentService
  card: CardService
  document: DocumentService
  calendar: CalendarService
}

export interface DIContainer extends ServiceContainer {
  /** Domain store — singleton */
  domain: DomainStore

  /** Factories */
  createChatVM: (initialMessages?: Message[]) => ChatViewModel
  createCardQueueVM: () => CardQueueViewModel
  createTodayVM: (
    cardQueueVM: CardQueueViewModel,
    chatVM: ChatViewModel,
  ) => TodayViewModel
  createWorkspaceVM: (
    config: WorkspaceConfig,
    cardQueueVM: CardQueueViewModel,
    chatVM: ChatViewModel,
  ) => WorkspaceViewModel
}

// ─── Production container ──────────────────────────────────

export function createProductionContainer(): DIContainer {
  // Singletons
  const agent = new AgentService()
  const card = new CardService()
  const document = new DocumentService()
  const calendar = new CalendarService()
  const domain = new DomainStore({ agent, card, document, calendar })

  return {
    // Services
    agent,
    card,
    document,
    calendar,

    // Domain
    domain,

    // Factories
    createChatVM: (initialMessages?: Message[]) =>
      new ChatViewModel(agent, card, initialMessages ?? []),

    createCardQueueVM: () => new CardQueueViewModel(domain),

    createTodayVM: (cardQueueVM, chatVM) =>
      new TodayViewModel(domain, cardQueueVM, chatVM),

    createWorkspaceVM: (config, cardQueueVM, chatVM) =>
      new WorkspaceViewModel(domain, config, cardQueueVM, chatVM),
  }
}

// ─── Test container (with overrides) ───────────────────────

export function createTestContainer(
  overrides?: Partial<ServiceContainer>,
): DIContainer {
  const agent = overrides?.agent ?? new AgentService()
  const card = overrides?.card ?? new CardService()
  const document = overrides?.document ?? new DocumentService()
  const calendar = overrides?.calendar ?? new CalendarService()
  const domain = new DomainStore({ agent, card, document, calendar })

  return {
    agent,
    card,
    document,
    calendar,
    domain,
    createChatVM: (initialMessages?: Message[]) =>
      new ChatViewModel(agent, card, initialMessages ?? []),
    createCardQueueVM: () => new CardQueueViewModel(domain),
    createTodayVM: (cardQueueVM, chatVM) =>
      new TodayViewModel(domain, cardQueueVM, chatVM),
    createWorkspaceVM: (config, cardQueueVM, chatVM) =>
      new WorkspaceViewModel(domain, config, cardQueueVM, chatVM),
  }
}
