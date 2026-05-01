import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Browse } from './features/browse/browse';
import { MediaDetails } from './features/movie-details/movie-details';
import { Search } from './features/search/search';
import { GenrePage } from './features/genre/genre';
import { Watchlist } from './features/watchlist/watchlist';
import { NotFound } from './features/not-found/not-found';
import { Login } from './features/login/login';
import { Register } from './features/register/register';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'browse/:mediaType', component: Browse },
  { path: 'movie/:id', component: MediaDetails },
  { path: 'tv/:id', component: MediaDetails },
  { path: 'search', component: Search },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'genre/:mediaType/:genreId/:genreName', component: GenrePage },
  { path: 'watchlist', component: Watchlist },
  { path: '**', component: NotFound },
];
