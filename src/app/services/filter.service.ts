import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Filter {
  searchTerm: string;
  startDate: string;
  endDate: string;
  categories: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterSubject = new BehaviorSubject<Filter>({
    searchTerm: '',
    startDate: '',
    endDate: '',
    categories: []
  });

  filter = this.filterSubject.asObservable();

  constructor() { }

  setFilter(filter: Filter) {
    this.filterSubject.next(filter);
  }
}

