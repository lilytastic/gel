import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralize'
})
export class PluralizePipe implements PipeTransform {

  transform(token: string, value: any): any {
    let transform: string = token;

    if (value === 1) {
      if (transform.endsWith('s')) {
        transform = transform.substr(0, transform.length - 1);
      }
    }
    else {
      if (!transform.endsWith('s')) {
        transform += 's';
      }
    }

    return transform;
  }

}
