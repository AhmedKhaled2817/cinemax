import { Component, OnInit, signal } from '@angular/core';
import { LocalStorageService, WatchlistItem } from '../../core/services/local-storage-service';
import { MovieRow } from '../../shared/components/movie-row/movie-row';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  imports: [MovieRow, RouterLink],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.scss',
})
export class Watchlist implements OnInit {
  watchlist = signal<WatchlistItem[]>([]);

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.watchlist.set(this.localStorageService.getWatchlist());
  }
}
