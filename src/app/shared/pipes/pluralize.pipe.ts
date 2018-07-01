import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralize'
})
export class PluralizePipe implements PipeTransform {

  transform(token: string, value: any): any {
    let transform: string = token;

    if (!transform.endsWith('s')) {
      transform += 's';
    }

    return transform;
  }

}
