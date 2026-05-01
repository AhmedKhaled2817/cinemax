import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../core/services/tmdb-service';
import { Movie, Tv, ApiResponse } from '../../core/models';
import { MovieCard } from '../../shared/components/movie-card/movie-card';

@Component({
  selector: 'app-genre',
  imports: [MovieCard],
  templateUrl: './genre.html',
  styleUrl: './genre.scss',
})
export class GenrePage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  mediaType!: 'movie' | 'tv';
  genreId!: number;
  genreName!: string;
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
      this.genreId = +params['genreId'];
      this.genreName = params['genreName'];
      this.page = 1;
      this.items.set([]);
      this.loadData();
    });
  }

  loadData(): void {
    this.loading.set(true);

    if (this.mediaType === 'movie') {
      this.tmdbService
        .getMoviesByGenre(this.genreId, this.page)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: ApiResponse<Movie>) => {
            this.items.set([...this.items(), ...res.results]);
            this.totalPages = res.total_pages;
            this.loading.set(false);
          },
          error: (err: any) => {
            console.error('Error loading genre data:', err);
            this.loading.set(false);
          },
        });
    } else {
      this.tmdbService
        .getTvShowsByGenre(this.genreId, this.page)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: ApiResponse<Tv>) => {
            this.items.set([...this.items(), ...res.results]);
            this.totalPages = res.total_pages;
            this.loading.set(false);
          },
          error: (err: any) => {
            console.error('Error loading genre data:', err);
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
}
