import { Observable, Subscription } from "rxjs";
import { makeObservable, observable, action, runInAction } from "mobx";
import { BaseViewModel } from "../base/BaseViewModel";
import { AgentService } from "../services/AgentService";
import { CardService } from "../services/CardService";
import { Message, Role } from "../models/Message";
import { uid } from "../services/mock/delay";

export class ChatViewModel extends BaseViewModel {
  messages: Message[] = [];
  isStreaming = false;
  inputValue = "";
  private agent: AgentService;
  private card: CardService;

  constructor(
    agent: AgentService,
    card: CardService,
    initialMessages: Message[] = []
  ) {
    super(); // subscriptions + dispose
    makeObservable(this, {
      messages: observable,
      isStreaming: observable,
      inputValue: observable,
      setInput: action,
      sendMessage: action,
      addAgentMessage: action,
      clearMessages: action,
    });
    this.agent = agent;
    this.card = card;
    this.messages = [...initialMessages];
  }

  setInput(value: string) {
    this.inputValue = value;
  }

  sendMessage(text?: string) {
    const content = (text ?? this.inputValue).trim();
    if (!content || this.isStreaming) return;

    const userMessage: Message = {
      id: uid("msg"),
      role: Role.User,
      content,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(userMessage);
    this.inputValue = "";
    this.startStreamingReply(content);
  }

  startStreamingReply(userMessage: string) {
    this.isStreaming = true;

    const agentMessage: Message = observable({
      id: uid("msg"),
      role: Role.Agent,
      content: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
      isPartial: true,
    });
    this.messages.push(agentMessage);

    const subscription = this.agent.streamReply(userMessage).subscribe({
      next: (char) => {
        runInAction(() => {
          agentMessage.content += char;
        });
      },
      complete: () => {
        runInAction(() => {
          agentMessage.isStreaming = false;
          agentMessage.isPartial = false;
          this.isStreaming = false;
        });
      },
    });
    this.track(subscription);
  }

  streamDigest(prompt: string) {
    if (this.isStreaming) return;
    this.isStreaming = true;

    const digestMessage: Message = observable({
      id: uid("msg"),
      role: Role.System,
      content: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
      isPartial: true,
      embeddedCards: [] as any[],
    });
    this.messages.push(digestMessage);

    const subscription = this.agent.streamDigest(prompt).subscribe({
      next: (char) => {
        runInAction(() => {
          digestMessage.content += char;
        });
      },
      complete: () => {
        runInAction(() => {
          digestMessage.isStreaming = false;
          digestMessage.isPartial = false;
          this.isStreaming = false;
        });
      },
    });
    this.track(subscription);
  }

  /** Ссылка на стримящийся дайджест-сообщение (для постепенного добавления карточек) */
  private streamingDigestMessage: Message | null = null;

  streamDigestWithCards(
    prompt: string,
    cardsByPriority: Record<string, any[]>
  ) {
    if (this.isStreaming) return;
    this.isStreaming = true;

    // Карточки НЕ задаём сразу — будут добавляться постепенно через addDigestCard()
    const digestMessage: Message = observable({
      id: uid("msg"),
      role: Role.System,
      content: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
      isPartial: true,
      embeddedCards: [] as any[],
    });
    this.messages.push(digestMessage);
    this.streamingDigestMessage = digestMessage;

    const subscription = this.agent.streamDigest(prompt).subscribe({
      next: (char) => {
        runInAction(() => {
          digestMessage.content += char;
        });
      },
      complete: () => {
        runInAction(() => {
          digestMessage.isStreaming = false;
          digestMessage.isPartial = false;
          this.isStreaming = false;
          this.streamingDigestMessage = null;
        });
      },
    });
    this.track(subscription);
  }

  /** Добавить карточку в стримящийся дайджест (вызывается AgentOrchestrator) */
  addDigestCard(card: any) {
    if (!this.streamingDigestMessage) return;
    runInAction(() => {
      this.streamingDigestMessage!.embeddedCards!.push(card);
    });
  }

  addAgentMessage(content: string, sourceRefs?: any[]) {
    this.messages.push({
      id: uid("msg"),
      role: Role.Agent,
      content,
      timestamp: new Date().toISOString(),
      sourceRefs,
    });
  }

  clearMessages() {
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.messages = [];
    this.isStreaming = false;
  }
}
