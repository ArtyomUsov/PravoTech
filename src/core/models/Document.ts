export interface Document {
  id: string;
  title: string;
  type: "contract" | "court_doc" | "appendix" | "template";
  content: string;
  sections: DocumentSection[];
  workspaceId: string;
  metadata: Record<string, string>;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
}
