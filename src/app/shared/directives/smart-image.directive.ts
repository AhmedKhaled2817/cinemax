import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appSmartImage]',
  standalone: true,
})
export class SmartImageDirective {
  @Input() fallbackSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%231f1f1f'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23b3b3b3' font-family='Arial, sans-serif' font-size='24'%3EImage unavailable%3C/text%3E%3C/svg%3E";

  private usedFallback = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLImageElement>,
    private readonly renderer: Renderer2
  ) {
    const image = this.elementRef.nativeElement;
    this.renderer.setAttribute(image, 'loading', 'lazy');
    this.renderer.setAttribute(image, 'decoding', 'async');
    this.renderer.setAttribute(image, 'referrerpolicy', 'no-referrer');
  }

  @HostListener('error')
  onError(): void {
    if (this.usedFallback) {
      return;
    }

    this.usedFallback = true;
    this.renderer.setAttribute(this.elementRef.nativeElement, 'src', this.fallbackSrc);
  }
}
