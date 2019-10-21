import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'ellipsify',
})
export class EllipsisPipe implements PipeTransform {
  transform(str: string): string {
    return str.length > 15 ? str.substring(0, 15) + '...' : str;
  }
}
