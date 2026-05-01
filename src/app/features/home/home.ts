import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  OnInit,
  DestroyRef,
  inject,
  signal,
  effect,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../core/services/tmdb-service';
import { Movie, Tv, ApiResponse } from '../../core/models';
import { HeroBanner } from '../../shared/components/hero-banner/hero-banner';
import { MovieRow } from '../../shared/components/movie-row/movie-row';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../core/services/local-storage-service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-home',
  imports: [HeroBanner, MovieRow],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);

  @ViewChild('heroSwiper', { static: false }) heroSwiper!: ElementRef<any>;

  trendingMovies = signal<Movie[]>([]);
  popularMovies = signal<Movie[]>([]);
  topRatedMovies = signal<Movie[]>([]);
  upcomingMovies = signal<Movie[]>([]);
  trendingTv = signal<Tv[]>([]);
  popularTv = signal<Tv[]>([]);
  loading = signal(true);
  activeView = signal<'all' | 'movies' | 'tv'>('all');
  showBackToTop = signal(false);
  watchlistCount = signal(0);
  recentlyViewed = signal<(Movie | Tv)[]>([]);
  isLargeScreen = signal(window.innerWidth >= 992);

  sectionLinks = [
    { id: 'trending-movies', label: 'Trending Movies' },
    { id: 'popular-movies', label: 'Popular Movies' },
    { id: 'top-rated-movies', label: 'Top Rated Movies' },
    { id: 'upcoming-movies', label: 'Upcoming Movies' },
    { id: 'trending-tv', label: 'Trending TV Shows' },
    { id: 'popular-tv', label: 'Popular TV Shows' },
  ];

  constructor(private tmdbService: TmdbService) {}

  ngOnInit(): void {
    this.watchlistCount.set(this.localStorageService.getWatchlist().length);
    this.recentlyViewed.set(this.localStorageService.getRecentlyViewed());
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.updateSwiperAutoplay();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.isLargeScreen.set(window.innerWidth >= 992);
    this.updateSwiperAutoplay();
  }

  updateSwiperAutoplay(): void {
    if (this.heroSwiper?.nativeElement?.swiper) {
      const swiper = this.heroSwiper.nativeElement.swiper;
      if (this.isLargeScreen()) {
        swiper.autoplay.start();
      } else {
        swiper.autoplay.stop();
      }
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop.set(window.scrollY > 500);
  }

  loadData(): void {
    this.loading.set(true);

    forkJoin({
      trendingMovies: this.tmdbService.getTrendingMovies(),
      popularMovies: this.tmdbService.getPopularMovies(),
      topRatedMovies: this.tmdbService.getTopRatedMovies(),
      upcomingMovies: this.tmdbService.getUpcomingMovies(),
      trendingTv: this.tmdbService.getTrendingTvShows(),
      popularTv: this.tmdbService.getPopularTvShows(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: {
          trendingMovies: ApiResponse<Movie>;
          popularMovies: ApiResponse<Movie>;
          topRatedMovies: ApiResponse<Movie>;
          upcomingMovies: ApiResponse<Movie>;
          trendingTv: ApiResponse<Tv>;
          popularTv: ApiResponse<Tv>;
        }) => {
          this.trendingMovies.set(data.trendingMovies.results);
          this.popularMovies.set(data.popularMovies.results);
          this.topRatedMovies.set(data.topRatedMovies.results);
          this.upcomingMovies.set(data.upcomingMovies.results);
          this.trendingTv.set(data.trendingTv.results);
          this.popularTv.set(data.popularTv.results);
          this.watchlistCount.set(this.localStorageService.getWatchlist().length);
          this.recentlyViewed.set(this.localStorageService.getRecentlyViewed());
          this.loading.set(false);
        },
        error: (err: any) => {
          console.error('Error loading home data:', err);
          this.loading.set(false);
        },
      });
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  surpriseMe(): void {
    const pools = [
      ...this.trendingMovies().map((item) => ({ item, mediaType: 'movie' as const })),
      ...this.popularMovies().map((item) => ({ item, mediaType: 'movie' as const })),
      ...this.topRatedMovies().map((item) => ({ item, mediaType: 'movie' as const })),
      ...this.upcomingMovies().map((item) => ({ item, mediaType: 'movie' as const })),
      ...this.trendingTv().map((item) => ({ item, mediaType: 'tv' as const })),
      ...this.popularTv().map((item) => ({ item, mediaType: 'tv' as const })),
    ];

    if (pools.length === 0) {
      return;
    }

    const randomPick = pools[Math.floor(Math.random() * pools.length)];
    this.router.navigate([`/${randomPick.mediaType}/${randomPick.item.id}`]);
  }

  setView(view: 'all' | 'movies' | 'tv'): void {
    this.activeView.set(view);
  }

  shouldShowMovies(): boolean {
    return this.activeView() === 'all' || this.activeView() === 'movies';
  }

  shouldShowTv(): boolean {
    return this.activeView() === 'all' || this.activeView() === 'tv';
  }

  refreshContent(): void {
    this.loadData();
  }

  backToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getTotalLoadedItems(): number {
    return (
      this.trendingMovies().length +
      this.popularMovies().length +
      this.topRatedMovies().length +
      this.upcomingMovies().length +
      this.trendingTv().length +
      this.popularTv().length
    );
  }
}
