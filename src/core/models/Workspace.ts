export interface TabConfig {
  id: string;
  label: string;
  type: "document-list" | "event-list" | "chat-list";
  workspaceFilter?: string; // если задан — фильтровать документы/события по workspaceId
}

export interface WorkspaceConfig {
  id: string;
  title: string;
  icon: string;
  tabs: TabConfig[];
  cardTypes: string[];
  agentSkills: string[];
}
