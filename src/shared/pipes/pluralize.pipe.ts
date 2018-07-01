import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralize'
})
export class PluralizePipe implements PipeTransform {

  transform(token: string, value: any): any {
    let transform: string = token;

    if (token.endsWith('s')) {
      transform = token.substr(0, token.length - 1);
    }
    if (value !== 1) {
      transform += 's';
    }

    return transform;
  }

}
