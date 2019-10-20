import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'ellipsify',
})
export class EllipsisPipe implements PipeTransform {
  transform(str: string): string {
    return str.length > 10 ? str.substring(0, 10) + '...' : str;
  }
}
