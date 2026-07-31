import { Document } from "../models/Document";
import { contractDocuments, litigationDocuments, simulateDelay } from "./mock";

export class DocumentService {
  async getDocumentsByWorkspace(workspaceId: string): Promise<Document[]> {
    await simulateDelay(200, 500);
    if (workspaceId === "contracts") return [...contractDocuments];
    if (workspaceId === "litigation") return [...litigationDocuments];
    return [];
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    await simulateDelay(100, 300);
    const allDocs = [...contractDocuments, ...litigationDocuments];
    return allDocs.find((d) => d.id === id);
  }
}
