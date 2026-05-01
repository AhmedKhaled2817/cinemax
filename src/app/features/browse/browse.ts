import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../core/services/tmdb-service';
import { Movie, Tv, ApiResponse } from '../../core/models';
import { MovieRow } from '../../shared/components/movie-row/movie-row';
import { SkeletonLoader } from '../../shared/components/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-browse',
  imports: [MovieRow, SkeletonLoader],
  templateUrl: './browse.html',
  styleUrl: './browse.scss',
})
export class Browse implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  mediaType!: 'movie' | 'tv';
  items = signal<(Movie | Tv)[]>([]);
  loading = signal(true);
  page = 1;
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.mediaType = params['mediaType'] as 'movie' | 'tv';
      this.page = 1;
      this.items.set([]);
      this.loadData();
    });
  }

  loadData(): void {
    this.loading.set(true);

    if (this.mediaType === 'movie') {
      this.tmdbService
        .getPopularMovies(this.page)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: ApiResponse<Movie>) => {
            this.items.set([...this.items(), ...res.results]);
            this.totalPages = res.total_pages;
            this.loading.set(false);
          },
          error: (err: any) => {
            console.error('Error loading browse data:', err);
            this.loading.set(false);
          },
        });
    } else {
      this.tmdbService
        .getPopularTvShows(this.page)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: ApiResponse<Tv>) => {
            this.items.set([...this.items(), ...res.results]);
            this.totalPages = res.total_pages;
            this.loading.set(false);
          },
          error: (err: any) => {
            console.error('Error loading browse data:', err);
            this.loading.set(false);
          },
        });
    }
  }

  loadMore(): void {
    if (this.page < this.totalPages && !this.loading()) {
      this.page++;
      this.loadData();
    }
  }

  getTitle(): string {
    return this.mediaType === 'movie' ? 'Browse Movies' : 'Browse TV Shows';
  }

  getSubtitle(): string {
    return this.mediaType === 'movie'
      ? 'Trending picks, blockbusters, and audience favorites.'
      : 'Top TV picks, binge-worthy drama, and fan favorites.';
  }
}
