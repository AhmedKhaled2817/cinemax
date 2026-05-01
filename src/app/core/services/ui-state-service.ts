import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  private readonly activeRequests = signal(0);
  private readonly globalError = signal('');

  readonly isLoading = computed(() => this.activeRequests() > 0);
  readonly errorMessage = this.globalError.asReadonly();

  startRequest(): void {
    this.activeRequests.update((value) => value + 1);
  }

  endRequest(): void {
    this.activeRequests.update((value) => Math.max(0, value - 1));
  }

  setError(message: string): void {
    this.globalError.set(message);
  }

  clearError(): void {
    this.globalError.set('');
  }
}
