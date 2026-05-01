import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import {
  Movie,
  MovieDetails,
  Tv,
  TVShowDetails,
  GenreList,
  ApiResponse,
  MultiSearchResult,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private readonly baseUrl = environment.tmdb.baseUrl;

  constructor(private http: HttpClient) {}

  getTrendingMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/trending/movie/week`, { params });
  }

  getPopularMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/movie/popular`, { params });
  }

  getTopRatedMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/movie/top_rated`, { params });
  }

  getUpcomingMovies(page: number = 1): Observable<ApiResponse<Movie>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/movie/upcoming`, { params });
  }

  getTrendingTvShows(page: number = 1): Observable<ApiResponse<Tv>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Tv>>(`${this.baseUrl}/trending/tv/week`, { params });
  }

  getPopularTvShows(page: number = 1): Observable<ApiResponse<Tv>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Tv>>(`${this.baseUrl}/tv/popular`, { params });
  }

  getTopRatedTvShows(page: number = 1): Observable<ApiResponse<Tv>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<ApiResponse<Tv>>(`${this.baseUrl}/tv/top_rated`, { params });
  }

  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${id}`, {
      params: new HttpParams().set('append_to_response', 'credits,videos,similar'),
    });
  }

  getTvShowDetails(id: number): Observable<TVShowDetails> {
    return this.http.get<TVShowDetails>(`${this.baseUrl}/tv/${id}`, {
      params: new HttpParams().set('append_to_response', 'credits,videos,similar'),
    });
  }

  searchMulti(query: string, page: number = 1): Observable<ApiResponse<MultiSearchResult>> {
    const params = new HttpParams().set('query', query).set('page', page);
    return this.http.get<ApiResponse<MultiSearchResult>>(`${this.baseUrl}/search/multi`, {
      params,
    });
  }

  getMovieGenres(): Observable<GenreList> {
    return this.http.get<GenreList>(`${this.baseUrl}/genre/movie/list`);
  }

  getTvGenres(): Observable<GenreList> {
    return this.http.get<GenreList>(`${this.baseUrl}/genre/tv/list`);
  }

  getMoviesByGenre(genreId: number, page: number = 1): Observable<ApiResponse<Movie>> {
    const params = new HttpParams().set('with_genres', genreId).set('page', page);
    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/discover/movie`, { params });
  }

  getTvShowsByGenre(genreId: number, page: number = 1): Observable<ApiResponse<Tv>> {
    const params = new HttpParams().set('with_genres', genreId).set('page', page);
    return this.http.get<ApiResponse<Tv>>(`${this.baseUrl}/discover/tv`, { params });
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '';
    return `${environment.tmdb.imageUrl}/${size}${path}`;
  }
}
