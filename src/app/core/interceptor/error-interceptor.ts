import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UiStateService } from '../services/ui-state-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const uiState = inject(UiStateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Something went wrong. Please try again.';

      if (error.status === 0) {
        message = 'Network error. Check your internet connection.';
      } else if (error.status === 401) {
        message = 'Session expired. Please sign in again.';
      } else if (error.status === 404) {
        message = 'Requested resource was not found.';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again in a moment.';
      }

      uiState.setError(message);
      return throwError(() => error);
    })
  );
};
