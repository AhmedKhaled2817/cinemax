import { Cast, CrewMember } from "./cast";
import { Genre } from "./genre";
import { Video } from "./video";

export interface Tv {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  adult: boolean;
  original_language: string;
}
export interface TVShowDetails extends Tv {
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
  created_by: { id: number; name: string; profile_path: string | null }[];
  genres: Genre[];
  networks: { id: number; name: string; logo_path: string | null }[];
  credits?: { cast: Cast[]; crew: CrewMember[] };
  videos?: { results: Video[] };
  similar?: { results: Tv[] };
}
