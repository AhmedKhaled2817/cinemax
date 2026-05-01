import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  imports: [],
  templateUrl: './skeleton-loader.html',
  styleUrl: './skeleton-loader.scss',
})
export class SkeletonLoader {
  @Input() variant: 'row' | 'grid' = 'row';
  @Input() rows = 1;
  @Input() cardsPerRow = 6;

  createRange(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index);
  }
}
