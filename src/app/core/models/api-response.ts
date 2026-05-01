import { Tv } from './tv';
import { Movie } from "./movie";

export interface ApiResponse<T>{
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface MultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
  profile_path?: string | null;
  known_for?: (Movie | Tv)[];
  known_for_department?: string;
}