import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../core/services/tmdb-service';
import { LocalStorageService, WatchlistItem } from '../../core/services/local-storage-service';
import {
  MovieDetails as MovieDetailsInterface,
  TVShowDetails,
  Cast,
  Video,
  Movie,
  Tv,
} from '../../core/models';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { DecimalPipe, DatePipe } from '@angular/common';
import { YouTubePlayer } from '@angular/youtube-player';
import { SmartImageDirective } from '../../shared/directives/smart-image.directive';
import { PreventDoubleClickDirective } from '../../shared/directives/prevent-double-click.directive';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-movie-details',
  imports: [
    DatePipe,
    DecimalPipe,
    MovieCard,
    YouTubePlayer,
    SmartImageDirective,
    PreventDoubleClickDirective,
    FormsModule,
    RatingModule,
  ],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
})
export class MediaDetails implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  mediaType!: 'movie' | 'tv';
  id!: number;
  details = signal<MovieDetailsInterface | TVShowDetails | null>(null);
  cast = signal<Cast[]>([]);
  videos = signal<Video[]>([]);
  similar = signal<(Movie | Tv)[]>([]);
  loading = signal(true);
  showTrailer = signal(false);
  trailerKey = signal('');
  userRating = signal(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.mediaType = this.router.url.startsWith('/movie') ? 'movie' : 'tv';
      this.id = +params['id'];
      this.userRating.set(this.localStorageService.getUserRating(this.id, this.mediaType));
      this.loadData();
    });
  }

  loadData(): void {
    this.loading.set(true);

    if (this.mediaType === 'movie') {
      this.tmdbService
        .getMovieDetails(this.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: MovieDetailsInterface) => {
            this.details.set(data);
            this.cast.set(data.credits?.cast.slice(0, 10) || []);
            this.videos.set(data.videos?.results || []);
            this.similar.set(data.similar?.results || []);
            this.findTrailer();
            this.loading.set(false);
          },
          error: (err: any) => {
            console.error('Error loading details:', err);
            this.loading.set(false);
          },
        });
    } else {
      this.tmdbService
        .getTvShowDetails(this.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: TVShowDetails) => {
            this.details.set(data);
            this.cast.set(data.credits?.cast.slice(0, 10) || []);
            this.videos.set(data.videos?.results || []);
            this.similar.set(data.similar?.results || []);
            this.findTrailer();
            this.loading.set(false);
          },
          error: (err: any) => {
            console.error('Error loading details:', err);
            this.loading.set(false);
          },
        });
    }
  }

  findTrailer(): void {
    const trailer = this.videos().find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    if (trailer) {
      this.trailerKey.set(trailer.key);
    }
  }

  getTitle(): string {
    const d = this.details();
    if (!d) return '';
    return 'title' in d ? d.title : d.name;
  }

  getReleaseDate(): string {
    const d = this.details();
    if (!d) return '';
    return 'release_date' in d ? d.release_date : d.first_air_date;
  }

  getRuntimeOrSeasons(): string {
    const d = this.details();
    if (!d) return '';
    if ('runtime' in d) {
      const hours = Math.floor(d.runtime / 60);
      const minutes = d.runtime % 60;
      return `${hours}h ${minutes}m`;
    } else {
      return `${d.number_of_seasons} Seasons`;
    }
  }

  getBackdropUrl(): string {
    const d = this.details();
    if (!d) return '';
    return this.tmdbService.getImageUrl(d.backdrop_path, 'w1280');
  }

  getPosterUrl(): string {
    const d = this.details();
    if (!d) return '';
    return this.tmdbService.getImageUrl(d.poster_path, 'w500');
  }

  getCastImage(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'w185');
  }

  toggleWatchlist(): void {
    const d = this.details();
    if (!d) return;
    const watchlistItem: WatchlistItem = {
      ...d,
      media_type: this.mediaType,
    };
    this.localStorageService.toggleWatchlist(watchlistItem);
  }

  isInWatchlist(): boolean {
    return this.localStorageService.isInWatchlist(this.id, this.mediaType);
  }

  openTrailer(): void {
    if (this.trailerKey()) {
      this.showTrailer.set(true);
    }
  }

  closeTrailer(): void {
    this.showTrailer.set(false);
  }

  onRatingChange(rating: number | null): void {
    const nextRating = rating ?? 0;
    this.userRating.set(nextRating);
    this.localStorageService.setUserRating(this.id, this.mediaType, nextRating);
  }

  clearRating(): void {
    this.onRatingChange(0);
  }
}
