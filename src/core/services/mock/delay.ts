import { Observable, from, timer } from "rxjs";
import { concatMap, mapTo } from "rxjs/operators";

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function simulateDelay(min = 300, max = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, randomBetween(min, max)));
}

export function streamText(text: string, charDelay = 25): Observable<string> {
  const chars = text.split("");
  return from(chars).pipe(
    concatMap((char) => timer(charDelay).pipe(mapTo(char)))
  );
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
