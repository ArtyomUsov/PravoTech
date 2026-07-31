import { Subscription } from "rxjs";

/**
 * Base class for all ViewModels.
 *
 * Provides:
 * - RxJS subscription tracking with automatic cleanup (track())
 * - dispose() lifecycle hook
 *
 * IMPORTANT: Each subclass MUST call makeAutoObservable(this) in its constructor,
 * because MobX 6 does not support makeAutoObservable in classes with a superclass.
 */
export abstract class BaseViewModel {
  /** Aggregated RxJS subscriptions — auto-unsubscribed in dispose() */
  protected subscriptions = new Subscription();

  /** Guard against double-dispose */
  protected disposed = false;

  /** Add one or more subscriptions — they will be cleaned up automatically */
  protected track(...subs: Subscription[]): void {
    subs.forEach((s) => this.subscriptions.add(s));
  }

  /** Called when the ViewModel is no longer needed (page unmount, etc.) */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }
}
