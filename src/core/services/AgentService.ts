import { Observable } from "rxjs";
import { Message, Role } from "../models/Message";
import { findAgentReply, streamText, uid } from "./mock";

export class AgentService {
  streamReply(userMessage: string): Observable<string> {
    const reply = findAgentReply(userMessage);
    return streamText(reply, 20);
  }

  streamDigest(prompt: string): Observable<string> {
    // Агент получает промпт с данными и генерирует ответ
    return streamText(prompt, 15);
  }

  async createSystemMessage(
    content: string,
    sourceRefs?: any[]
  ): Promise<Message> {
    return {
      id: uid("msg"),
      role: Role.Agent,
      content,
      timestamp: new Date().toISOString(),
      sourceRefs,
    };
  }
}
