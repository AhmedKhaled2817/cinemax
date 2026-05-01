import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { UiStateService } from './core/services/ui-state-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly uiState = inject(UiStateService);

  isLoading = this.uiState.isLoading;
  errorMessage = this.uiState.errorMessage;

  dismissError(): void {
    this.uiState.clearError();
  }
}
