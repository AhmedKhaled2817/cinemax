import { Component, OnInit, signal, DestroyRef, inject, HostListener, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../core/services/tmdb-service';
import { MultiSearchResult, Movie, Tv, ApiResponse } from '../../core/models';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { LocalStorageService } from '../../core/services/local-storage-service';

@Component({
  selector: 'app-search',
  imports: [MovieCard],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  query = '';
  results = signal<(Movie | Tv)[]>([]);
  loading = signal(false);
  sortBy = signal<'relevance' | 'rating' | 'latest' | 'popular'>('relevance');
  searchHistory = signal<string[]>([]);
  page = 1;
  totalPages = 1;

  sortedResults = computed<(Movie | Tv)[]>(() => {
    const current = [...this.results()];
    const mode = this.sortBy();

    if (mode === 'relevance') {
      return current;
    }

    if (mode === 'rating') {
      return current.sort((a, b) => b.vote_average - a.vote_average);
    }

    if (mode === 'popular') {
      return current.sort((a, b) => b.popularity - a.popularity);
    }

    return current.sort((a, b) => this.getItemDate(b).localeCompare(this.getItemDate(a)));
  });

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.searchHistory.set(this.localStorageService.getSearchHistory());

    this.route.queryParams
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.query = params['q'] || '';
        if (this.query.trim().length > 0) {
          this.localStorageService.addSearchHistory(this.query);
          this.searchHistory.set(this.localStorageService.getSearchHistory());
          this.page = 1;
          this.results.set([]);
          this.search();
        } else {
          this.results.set([]);
        }
      });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 600;
    if (nearBottom) {
      this.loadMore();
    }
  }

  search(): void {
    this.loading.set(true);

    this.tmdbService.searchMulti(this.query, this.page).subscribe({
      next: (res: ApiResponse<MultiSearchResult>) => {
        const mappedResults: (Movie | Tv)[] = [];

        for (const item of res.results) {
          if (item.media_type === 'movie') {
            mappedResults.push({
              id: item.id,
              title: item.title || '',
              original_title: item.original_title || '',
              overview: item.overview,
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              release_date: item.release_date || '',
              vote_average: item.vote_average,
              vote_count: 0,
              popularity: item.popularity,
              genre_ids: item.genre_ids,
              adult: false,
              original_language: '',
              video: false,
            } as Movie);
          } else if (item.media_type === 'tv') {
            mappedResults.push({
              id: item.id,
              name: item.name || '',
              original_name: item.original_name || '',
              overview: item.overview,
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              first_air_date: item.first_air_date || '',
              vote_average: item.vote_average,
              vote_count: 0,
              popularity: item.popularity,
              genre_ids: item.genre_ids,
              origin_country: [],
              adult: false,
              original_language: '',
            } as Tv);
          }
        }

        this.results.set([...this.results(), ...mappedResults]);
        this.totalPages = res.total_pages;
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Search error:', err);
        this.loading.set(false);
      },
    });
  }

  loadMore(): void {
    if (this.page < this.totalPages && !this.loading()) {
      this.page++;
      this.search();
    }
  }

  getMediaType(item: Movie | Tv): 'movie' | 'tv' {
    return 'title' in item ? 'movie' : 'tv';
  }

  getTitle(item: Movie | Tv): string {
    return 'title' in item ? item.title : item.name;
  }

  setSort(sort: 'relevance' | 'rating' | 'latest' | 'popular'): void {
    this.sortBy.set(sort);
  }

  runHistorySearch(term: string): void {
    this.router.navigate(['/search'], { queryParams: { q: term } });
  }

  clearHistory(): void {
    this.localStorageService.clearSearchHistory();
    this.searchHistory.set([]);
  }

  private getItemDate(item: Movie | Tv): string {
    return 'release_date' in item ? item.release_date || '' : item.first_air_date || '';
  }
}
