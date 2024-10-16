import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { Filter } from '../models/filter.model';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // Inyecta el servicio FilterService en la variable service
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    // Verifica que el servicio se haya creado correctamente
    expect(service).toBeTruthy();
  });

  it('should have an initial filter state', (done) => {
    // Verifica que el estado inicial del filtro es el esperado
    service.filter.subscribe((filter) => {
      expect(filter).toEqual({
        searchTerm: '',
        startDate: '',
        endDate: '',
        categories: []
      }); 
      done(); // Indica que la prueba ha terminado
    });
  });

  it('should update the filter when setFilter is called', (done) => {
    // Define un nuevo estado de filtro para probar
    const newFilter: Filter = {
      searchTerm: 'test',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      categories: ['1', '2']
    };

    // Se suscribe al observable filter para verificar la actualización
    const subscription = service.filter.subscribe((filter) => {
      if (filter === newFilter) {
        // Verifica que el filtro actualizado es igual al nuevo filtro
        expect(filter).toEqual(newFilter);
        subscription.unsubscribe();
        done(); // Indica que la prueba ha terminado
      }
    });

    // Llama al método setFilter para actualizar el filtro
    service.setFilter(newFilter);
  });
});
