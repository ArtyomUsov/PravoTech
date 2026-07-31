import React from "react";
import { observer } from "mobx-react-lite";
import { TaskListViewModel } from "../../viewmodels/TaskListViewModel";
import { TaskListItem } from "./TaskListItem";
import { SideListPanel } from "../common/SideListPanel";

export const TaskListPanel = observer(
  ({
    taskListVM,
    onOpenDocument,
  }: {
    taskListVM: TaskListViewModel;
    onOpenDocument?: (docId: string) => void;
  }) => {
    const tasks = taskListVM.tasks;

    return (
      <SideListPanel
        title="Задачи агента"
        items={tasks}
        selectedItem={taskListVM.selectedTaskId}
        onSelect={(id) => taskListVM.selectTask(id)}
        emptyText="Нет задач"
        renderItem={(card, selected) => (
          <TaskListItem
            key={card.id}
            card={card}
            selected={selected}
            actionLabel={taskListVM.getTaskActionLabel(card)}
            progress={taskListVM.getProgress(card.id)}
            onSelect={(id) => taskListVM.selectTask(id)}
            onOpenDocument={onOpenDocument}
          />
        )}
      />
    );
  }
);
