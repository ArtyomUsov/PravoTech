import {
  makeObservable,
  observable,
  computed,
  action,
  runInAction,
} from "mobx";
import { BaseViewModel } from "../base/BaseViewModel";
import { DomainStore } from "../domain/DomainStore";
import { AgentOrchestrator } from "../domain/AgentOrchestrator";
import { CardQueueViewModel } from "./CardQueueViewModel";
import { ChatViewModel } from "./ChatViewModel";
import { TaskListViewModel } from "./TaskListViewModel";
import { CalendarEvent } from "../models/CalendarEvent";

export class TodayViewModel extends BaseViewModel {
  chatVM: ChatViewModel;
  cardQueueVM: CardQueueViewModel;
  taskListVM: TaskListViewModel;
  calendarEvents: CalendarEvent[] = [];
  isLoadingCalendar = false;
  private domain: DomainStore;
  private orchestrator: AgentOrchestrator;

  constructor(
    domain: DomainStore,
    cardQueueVM: CardQueueViewModel,
    taskListVM: TaskListViewModel,
    chatVM: ChatViewModel
  ) {
    super(); // subscriptions + dispose
    makeObservable(this, {
      calendarEvents: observable,
      isLoadingCalendar: observable,
      calendarEventList: computed,
      init: action,
    });
    this.domain = domain;
    this.chatVM = chatVM;
    this.cardQueueVM = cardQueueVM;
    this.taskListVM = taskListVM;
    this.orchestrator = new AgentOrchestrator(domain, chatVM);
  }

  get calendarEventList(): CalendarEvent[] {
    return this.domain.calendarEventList;
  }

  async init() {
    // Загружаем документы и календарь параллельно с работой агента
    // Агент начинает анализ сразу, документы подгружаются фоном
    await Promise.all([
      this.domain.loadInitialData(),
      this.orchestrator.runStartup(),
    ]);
  }
}
