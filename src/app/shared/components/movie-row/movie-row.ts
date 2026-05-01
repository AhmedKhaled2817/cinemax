import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Movie, Tv } from '../../../core/models';
import { MovieCard } from '../movie-card/movie-card';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-movie-row',
  imports: [MovieCard],
  templateUrl: './movie-row.html',
  styleUrl: './movie-row.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MovieRow {
  @ViewChild('swiperRef') swiperRef?: ElementRef;

  @Input({ required: true }) title!: string;
  @Input({ required: true }) items!: (Movie | Tv)[];
  @Input() mediaType?: 'movie' | 'tv';
  @Input() autoPlay = true;
  private resumeTimer?: ReturnType<typeof setTimeout>;

  slidePrev(): void {
    this.handleManualSlide('prev');
  }

  slideNext(): void {
    this.handleManualSlide('next');
  }

  pauseAutoPlay(): void {
    if (!this.autoPlay) return;
    this.swiperRef?.nativeElement?.swiper?.autoplay?.stop();
  }

  resumeAutoPlay(): void {
    if (!this.autoPlay) return;
    this.swiperRef?.nativeElement?.swiper?.autoplay?.start();
  }

  private handleManualSlide(direction: 'prev' | 'next'): void {
    const swiper = this.swiperRef?.nativeElement?.swiper;
    if (!swiper) return;

    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
    }

    // Pause briefly so button click feels responsive and clear.
    swiper.autoplay?.stop();
    direction === 'prev' ? swiper.slidePrev(450) : swiper.slideNext(450);

    this.resumeTimer = setTimeout(() => {
      if (this.autoPlay) {
        swiper.autoplay?.start();
      }
    }, 1800);
  }

  getItemMediaType(item: Movie | Tv): 'movie' | 'tv' {
    if (this.mediaType) {
      return this.mediaType;
    }
    return 'title' in item ? 'movie' : 'tv';
  }
}
  