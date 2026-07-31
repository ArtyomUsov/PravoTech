import { Observable, Subject, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { ActionCard, CardStatus } from "../models/ActionCard";
import { actionCards, simulateDelay } from "./mock";

export class CardService {
  private cardSubject = new Subject<ActionCard[]>();
  private cards: ActionCard[] = [...actionCards];

  cardStream$ = this.cardSubject.asObservable();

  async getCards(): Promise<ActionCard[]> {
    await simulateDelay(200, 400);
    return [...this.cards];
  }

  getCardsByWorkspace(workspaceId: string): ActionCard[] {
    return this.cards.filter((c) => c.workspaceId === workspaceId);
  }

  resolveCard(
    cardId: string,
    decision: "approved" | "modified" | "rejected" | "acknowledged",
    comment?: string
  ): Observable<ActionCard> {
    const card = this.cards.find((c) => c.id === cardId);
    if (!card) {
      throw new Error(`Card ${cardId} not found`);
    }

    card.status = CardStatus.Resolving;

    return of(card).pipe(
      delay(600),
      map(() => {
        card.status = CardStatus.Resolved;
        card.resolution = {
          decision,
          comment,
          timestamp: new Date().toISOString(),
        };
        this.cardSubject.next([...this.cards]);
        return { ...card };
      })
    );
  }

  refreshCards(): void {
    this.cardSubject.next([...this.cards]);
  }
}
