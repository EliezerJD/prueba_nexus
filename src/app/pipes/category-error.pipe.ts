import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryErrorPipe',
  standalone: true
})
export class CategoryErrorPipe implements PipeTransform {

  transform(categories: any[], errorMessage: string): any {
    // Si hay un error, devuelve un array con un mensaje de error
    if (errorMessage) {
      return [{ name: errorMessage }];
    }
    
    // Si no hay categorías, devuelve un mensaje que indica que no hay datos
    if (!categories || categories.length === 0) {
      return [{ name: 'No hay categorías disponibles' }];
    }

    // Si no hay error y hay categorías, devuelve la lista de categorías
    return categories;
  }

}
