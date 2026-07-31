import React from "react";
import { createProductionContainer, DIContainer } from "../di/Container";
import { DomainStore } from "../domain/DomainStore";
import { TodayViewModel } from "./TodayViewModel";
import { WorkspaceViewModel } from "./WorkspaceViewModel";
import { CardQueueViewModel } from "./CardQueueViewModel";
import { TaskListViewModel } from "./TaskListViewModel";
import { ChatViewModel } from "./ChatViewModel";
import { myCasesConfig } from "../services/mock/data";

export class RootStore {
  container: DIContainer;
  domain: DomainStore;
  cardQueueVM: CardQueueViewModel;
  taskListVM: TaskListViewModel;
  todayVM: TodayViewModel;
  myCasesWorkspaceVM: WorkspaceViewModel;
  currentWorkspaceVM: WorkspaceViewModel | null = null;

  constructor() {
    this.container = createProductionContainer();

    // DomainStore — единый источник правды
    this.domain = this.container.domain;

    // CardQueue — общая для всех, читает из DomainStore
    this.cardQueueVM = this.container.createCardQueueVM();

    // TaskList — для Today
    this.taskListVM = this.container.createTaskListVM(this.cardQueueVM);

    // Чат для «Сегодня»
    const todayChatVM = this.container.createChatVM();
    this.todayVM = this.container.createTodayVM(
      this.cardQueueVM,
      this.taskListVM,
      todayChatVM
    );

    // Единое рабочее пространство «Мои дела»
    const myCasesChatVM = this.container.createChatVM();
    this.myCasesWorkspaceVM = this.container.createWorkspaceVM(
      myCasesConfig,
      this.cardQueueVM,
      this.taskListVM,
      myCasesChatVM
    );
  }

  getWorkspace(id: string): WorkspaceViewModel | null {
    if (id === "my-cases") return this.myCasesWorkspaceVM;
    return null;
  }

  setCurrentWorkspace(id: string | null) {
    if (!id) {
      this.currentWorkspaceVM = null;
      return;
    }
    this.currentWorkspaceVM = this.getWorkspace(id);
  }

  /** Dispose all ViewModels — call on app unmount */
  dispose(): void {
    this.todayVM.dispose();
    this.myCasesWorkspaceVM.dispose();
    this.cardQueueVM.dispose();
  }
}

export const StoresContext = React.createContext<RootStore>(null!);

export function useMobx() {
  return React.useContext(StoresContext);
}
