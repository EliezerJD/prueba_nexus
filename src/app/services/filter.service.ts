import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filter } from '../models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  // Crea un BehaviorSubject que mantiene el estado del filtro
  private filterSubject = new BehaviorSubject<Filter>({
    searchTerm: '',
    startDate: '',
    endDate: '',
    categories: []
  });

  // Exponemos el observable del filtro para que otros componentes puedan suscribirse
  filter = this.filterSubject.asObservable();

  constructor() { }

  // Método para actualizar el filtro
  setFilter(filter: Filter) {
    this.filterSubject.next(filter); // Emite el nuevo filtro a todos los suscriptores
  }
}
