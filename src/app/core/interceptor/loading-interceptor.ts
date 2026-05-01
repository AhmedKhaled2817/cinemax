import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { UiStateService } from '../services/ui-state-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const uiState = inject(UiStateService);

  uiState.startRequest();

  return next(req).pipe(
    finalize(() => {
      uiState.endRequest();
    })
  );
};
