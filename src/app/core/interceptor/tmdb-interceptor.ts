import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environment/environment';

export const tmdbInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    params: req.params.set('api_key', environment.tmdb.apiKey),
  });
  return next(modifiedReq);
};
