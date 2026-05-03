import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Movie, Tv } from '../models';

export type WatchlistItem = (Movie | Tv) & { media_type: 'movie' | 'tv' };

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly WATCHLIST_KEY = 'cinemax_watchlist';
  private readonly RECENTLY_VIEWED_KEY = 'cinemax_recently_viewed';
  private readonly SEARCH_HISTORY_KEY = 'cinemax_search_history';
  private readonly USER_RATINGS_KEY = 'cinemax_user_ratings';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getWatchlist(): WatchlistItem[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveWatchlist(watchlist: WatchlistItem[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(watchlist));
  }

  addToWatchlist(item: WatchlistItem): void {
    const watchlist = this.getWatchlist();
    if (!this.isInWatchlist(item.id, item.media_type)) {
      watchlist.push(item);
      this.saveWatchlist(watchlist);
    }
  }

  removeFromWatchlist(id: number, mediaType: 'movie' | 'tv'): void {
    const watchlist = this.getWatchlist();
    const filtered = watchlist.filter(
      (item) => !(item.id === id && item.media_type === mediaType)
    );
    this.saveWatchlist(filtered);
  }

  isInWatchlist(id: number, mediaType: 'movie' | 'tv'): boolean {
    const watchlist = this.getWatchlist();
    return watchlist.some(
      (item) => item.id === id && item.media_type === mediaType
    );
  }

  toggleWatchlist(item: WatchlistItem): boolean {
    if (this.isInWatchlist(item.id, item.media_type)) {
      this.removeFromWatchlist(item.id, item.media_type);
      return false;
    } else {
      this.addToWatchlist(item);
      return true;
    }
  }

  getRecentlyViewed(): WatchlistItem[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.RECENTLY_VIEWED_KEY);
    return data ? JSON.parse(data) : [];
  }

  addRecentlyViewed(item: WatchlistItem): void {
    const recentlyViewed = this.getRecentlyViewed().filter(
      (entry) => !(entry.id === item.id && entry.media_type === item.media_type)
    );
    recentlyViewed.unshift(item);
    this.safeSet(this.RECENTLY_VIEWED_KEY, recentlyViewed.slice(0, 20));
  }

  getSearchHistory(): string[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  addSearchHistory(query: string): void {
    const normalized = query.trim();
    if (!normalized) return;

    const history = this.getSearchHistory().filter(
      (entry) => entry.toLowerCase() !== normalized.toLowerCase()
    );
    history.unshift(normalized);
    this.safeSet(this.SEARCH_HISTORY_KEY, history.slice(0, 8));
  }

  clearSearchHistory(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.SEARCH_HISTORY_KEY);
  }

  getUserRating(id: number, mediaType: 'movie' | 'tv'): number {
    const ratings = this.getUserRatingsMap();
    return ratings[this.ratingEntryKey(id, mediaType)] ?? 0;
  }

  setUserRating(id: number, mediaType: 'movie' | 'tv', rating: number): void {
    const ratings = this.getUserRatingsMap();
    const key = this.ratingEntryKey(id, mediaType);
    const rounded = Math.max(0, Math.min(5, Math.round(rating)));

    if (rounded === 0) {
      delete ratings[key];
    } else {
      ratings[key] = rounded;
    }

    this.safeSet(this.USER_RATINGS_KEY, ratings);
  }

  getAllUserRatings(): Record<string, number> {
    return this.getUserRatingsMap();
  }

  private getUserRatingsMap(): Record<string, number> {
    if (!this.isBrowser) return {};
    const data = localStorage.getItem(this.USER_RATINGS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private ratingEntryKey(id: number, mediaType: 'movie' | 'tv'): string {
    return `${mediaType}:${id}`;
  }

  private safeSet<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }
}