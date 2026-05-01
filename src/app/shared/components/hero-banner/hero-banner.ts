import { Component, Input, output } from '@angular/core';
import { Router } from '@angular/router';
import { Movie, Tv } from '../../../core/models';
import { TmdbService } from '../../../core/services/tmdb-service';

@Component({
  selector: 'app-hero-banner',
  imports: [],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.scss',
})
export class HeroBanner {
  @Input({ required: true }) item!: Movie | Tv;
  @Input({ required: true }) mediaType!: 'movie' | 'tv';
  @Input() showButtons = true;
  playTrailer = output<Movie | Tv>();

  constructor(private router: Router, private tmdbService: TmdbService) {}

  getImageUrl(path: string | null): string {
    return this.tmdbService.getImageUrl(path, 'w1280');
  }

  getTitle(): string {
    return 'title' in this.item ? this.item.title : this.item.name;
  }

  goToDetails(): void {
    this.router.navigate([`/${this.mediaType}/${this.item.id}`]);
  }
}