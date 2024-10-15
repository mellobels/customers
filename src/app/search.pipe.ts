import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], filter: string): any[] {
    if (!filter) return value;
    filter = filter.toLowerCase();
    return value.filter(item => {
      for (const key in item) {
        if (item[key] && item[key].toString().toLowerCase().includes(filter)) {
          return true;
        }
      }
      return false;
    });
  }
}
