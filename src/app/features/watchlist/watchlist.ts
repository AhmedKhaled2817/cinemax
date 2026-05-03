import { Component, OnInit, signal } from '@angular/core';
import { LocalStorageService, WatchlistItem } from '../../core/services/local-storage-service';
import { MovieRow } from '../../shared/components/movie-row/movie-row';
import { RouterLink } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { TmdbService } from '../../core/services/tmdb-service';
import { SmartImageDirective } from '../../shared/directives/smart-image.directive';

@Component({
  selector: 'app-watchlist',
  imports: [MovieRow, RouterLink, RatingModule, FormsModule, SmartImageDirective],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.scss',
})
export class Watchlist implements OnInit {
  watchlist = signal<WatchlistItem[]>([]);
  topRated = signal<WatchlistItem[]>([]);
  averageRating = signal(0);

  constructor(
    private localStorageService: LocalStorageService,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    const items = this.localStorageService.getWatchlist();
    const ratings = this.localStorageService.getAllUserRatings();
    const ratedItems = items
      .filter((item) => this.getItemRatingFromMap(item, ratings) > 0)
      .sort((a, b) => this.getItemRatingFromMap(b, ratings) - this.getItemRatingFromMap(a, ratings))
      .slice(0, 6);

    const avg =
      ratedItems.length > 0
        ? ratedItems.reduce((sum, item) => sum + this.getItemRatingFromMap(item, ratings), 0) / ratedItems.length
        : 0;

    this.watchlist.set(items);
    this.topRated.set(ratedItems);
    this.averageRating.set(Number(avg.toFixed(1)));
  }

  getItemRating(item: WatchlistItem): number {
    return this.localStorageService.getUserRating(item.id, item.media_type);
  }

  getPosterUrl(item: WatchlistItem): string {
    return this.tmdbService.getImageUrl(item.poster_path, 'w500');
  }

  getTitle(item: WatchlistItem): string {
    return 'title' in item ? item.title : item.name;
  }

  getDetailsLink(item: WatchlistItem): string {
    return `/${item.media_type}/${item.id}`;
  }

  private getItemRatingFromMap(item: WatchlistItem, ratings: Record<string, number>): number {
    return ratings[`${item.media_type}:${item.id}`] ?? 0;
  }
}
