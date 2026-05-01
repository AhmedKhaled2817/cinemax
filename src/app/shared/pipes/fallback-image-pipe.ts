import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallbackImage',
})
export class FallbackImagePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
