import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FilterComponent } from './filter.component';
import { ApiService } from '../../services/api.service';
import { FilterService } from '../../services/filter.service';
import { Category } from '../../models/category.model';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let filterServiceMock: jasmine.SpyObj<FilterService>;

  beforeEach(waitForAsync(() => {
    // Crear mocks para ApiService y FilterService
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getCategories']);
    filterServiceMock = jasmine.createSpyObj('FilterService', ['setFilter']);

    // Configura el mock para que devuelva un observable con categorías de ejemplo
    const mockCategories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' }
    ];
    apiServiceMock.getCategories.and.returnValue(of(mockCategories));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FilterComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: FilterService, useValue: filterServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    const mockCategories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' }
    ];

    // Simula la respuesta del servicio
    apiServiceMock.getCategories.and.returnValue(of(mockCategories));

    // Llama al método ngOnInit
    component.ngOnInit();

    // Verifica que se llamara al servicio
    expect(apiServiceMock.getCategories).toHaveBeenCalled();

    // Verifica que las categorías se hayan cargado correctamente
    expect(component.categories).toEqual(mockCategories);
  });

  it('should handle error when loading categories', () => {
    // Simula un error del servicio
    apiServiceMock.getCategories.and.returnValue(throwError(() => new Error('Error al cargar categorías')));

    // Espía para el console.error
    const consoleSpy = spyOn(console, 'error');

    // Llama al método ngOnInit
    component.ngOnInit();

    // Verifica que se llamara al servicio
    expect(apiServiceMock.getCategories).toHaveBeenCalled();

    // Verifica que se registró un error en la consola
    expect(consoleSpy).toHaveBeenCalledWith('Error al obtener los datos:', jasmine.any(Error));
  });

  it('should toggle filters visibility', () => {
    // Verifica el estado inicial
    expect(component.isFiltersVisible).toBeTrue();
    
    // Cambia la visibilidad
    component.toggleFiltersVisibility();
    expect(component.isFiltersVisible).toBeFalse();

    // Vuelve a cambiar la visibilidad
    component.toggleFiltersVisibility();
    expect(component.isFiltersVisible).toBeTrue();
  });

  it('should toggle category selection', () => {
    const categoryId = '1';

    // Verifica que la categoría no esté seleccionada inicialmente
    expect(component.isCategorySelected(categoryId)).toBeFalse();

    // Selecciona la categoría
    component.toggleCategory(categoryId);
    expect(component.isCategorySelected(categoryId)).toBeTrue();
    
    // Deselecciona la categoría
    component.toggleCategory(categoryId);
    expect(component.isCategorySelected(categoryId)).toBeFalse();
  });

  it('should apply filters', () => {
    const filterValues = {
      searchTerm: 'test',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      categories: ['1']
    };

    // Establece el valor del formulario
    component.filterForm.patchValue(filterValues);
    
    // Asegúrate de que la categoría se haya agregado a la matriz de categorías
    component.toggleCategory('1'); // Añadir la categoría al formulario
    
    // Llama a applyFilters
    component.applyFilters();
    
    // Verifica que se haya llamado a setFilter con los valores correctos
    expect(filterServiceMock.setFilter).toHaveBeenCalledWith(filterValues);
});


  it('should clear filters', () => {
    // Establece algunos valores en el formulario
    component.filterForm.patchValue({
      searchTerm: 'test',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      categories: ['1']
    });

    // Llama a clearFilters
    component.clearFilters();

    // Verifica que el formulario se haya restablecido a los valores iniciales
    expect(component.filterForm.value).toEqual({
      searchTerm: '',
      startDate: '',
      endDate: '',
      categories: []
    });
  });
});
