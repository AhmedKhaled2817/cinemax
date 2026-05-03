import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPreventDoubleClick]',
  standalone: true,
})
export class PreventDoubleClickDirective {
  @Input() appPreventDoubleClick: number | string | '' = 800;

  private locked = false;

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (this.locked) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.locked = true;
    const rawDuration = typeof this.appPreventDoubleClick === 'number'
      ? this.appPreventDoubleClick
      : Number.parseInt(this.appPreventDoubleClick || '800', 10);
    const duration = Number.isFinite(rawDuration) ? rawDuration : 800;
    window.setTimeout(() => {
      this.locked = false;
    }, duration);
  }
}
