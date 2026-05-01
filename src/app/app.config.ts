import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { tmdbInterceptor } from './core/interceptor/tmdb-interceptor';
import { loadingInterceptor } from './core/interceptor/loading-interceptor';
import { errorInterceptor } from './core/interceptor/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptors([loadingInterceptor, tmdbInterceptor, errorInterceptor])),
  ],
};
