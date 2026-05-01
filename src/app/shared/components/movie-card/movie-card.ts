import { Component, Input, output } from '@angular/core';
import { Router } from '@angular/router';
import { Movie, Tv } from '../../../core/models';
import { TmdbService } from '../../../core/services/tmdb-service';
import { LocalStorageService, WatchlistItem } from '../../../core/services/local-storage-service';

@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input({ required: true }) item!: Movie | Tv;
  @Input({ required: true }) mediaType!: 'movie' | 'tv';

  constructor(
    private router: Router,
    private tmdbService: TmdbService,
    private localStorageService: LocalStorageService
  ) {}

  getImageUrl(): string {
    return this.tmdbService.getImageUrl(this.item.poster_path, 'w500');
  }

  getTitle(): string {
    return 'title' in this.item ? this.item.title : this.item.name;
  }

  goToDetails(): void {
    const recentlyViewedItem: WatchlistItem = {
      ...this.item,
      media_type: this.mediaType,
    };
    this.localStorageService.addRecentlyViewed(recentlyViewedItem);
    this.router.navigate([`/${this.mediaType}/${this.item.id}`]);
  }

  toggleWatchlist(event: Event): void {
    event.stopPropagation();
    const watchlistItem: WatchlistItem = {
      ...this.item,
      media_type: this.mediaType
    };
    this.localStorageService.toggleWatchlist(watchlistItem);
  }

  isInWatchlist(): boolean {
    return this.localStorageService.isInWatchlist(this.item.id, this.mediaType);
  }
}