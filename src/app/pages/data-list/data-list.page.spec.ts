import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataListPage } from './data-list.page';
import { ApiService } from '../../services/api.service';
import { FilterService } from '../../services/filter.service';
import { of, throwError } from 'rxjs';
import { Item } from '../../models/item.model';
import { Category } from '../../models/category.model';

describe('DataListPage', () => {
  let component: DataListPage;
  let fixture: ComponentFixture<DataListPage>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let filterServiceMock: jasmine.SpyObj<FilterService>;

  const mockData: Item[] = [
    { id: '1', name: 'Item 1', createdAt: '2024-01-01', CategoryId: '1' },
    { id: '2', name: 'Item 2', createdAt: '2024-01-02', CategoryId: '1' },
    { id: '3', name: 'Item 3', createdAt: '2024-01-03', CategoryId: '2' },
  ];

  const mockCategories: Category[] = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' }
  ];

  beforeEach(waitForAsync(() => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['getData']);
    filterServiceMock = jasmine.createSpyObj('FilterService', ['setFilter']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DataListPage],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: FilterService, useValue: filterServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataListPage);
    component = fixture.componentInstance;

    // Simula la respuesta de getData
    apiServiceMock.getData.and.returnValue(of(mockData));

    // Simula la emisión del filtro
    filterServiceMock.filter = of({ searchTerm: '', startDate: '', endDate: '', categories: [] }); // Ajusta según tu lógica

    // Inicializa el componente
    component.ngOnInit();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error when getData fails', () => {
    const consoleErrorSpy = spyOn(console, 'error'); // Espía el método console.error
    apiServiceMock.getData.and.returnValue(throwError(() => new Error('Error al obtener los datos'))); // Simula un error

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener los datos:', jasmine.any(Error)); 
  });

  it('should filter data based on searchTerm', () => {
    const filterCriteria = { searchTerm: 'Item 1', startDate: '', endDate: '', categories: [] };
    component.filterData(filterCriteria);
    
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].name).toBe('Item 1');
  });

   it('should filter data based on endDate', () => {
    const filterCriteria = { searchTerm: '', startDate: '', endDate: '2024-01-01', categories: [] };
    component.filterData(filterCriteria);

    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].name).toBe('Item 1');
  });

  it('should filter data based on categories', () => {
    const filterCriteria = { searchTerm: '', startDate: '', endDate: '', categories: ['1'] };
    component.filterData(filterCriteria);

    expect(component.filteredData.length).toBe(2);
  });

  it('should return all data if no filters are applied', () => {
    const filterCriteria = { searchTerm: '', startDate: '', endDate: '', categories: [] };
    component.filterData(filterCriteria);

    expect(component.filteredData.length).toBe(mockData.length);
  });

  it('should handle empty results gracefully', () => {
    const filterCriteria = { searchTerm: 'Non-existent', startDate: '', endDate: '', categories: [] };
    component.filterData(filterCriteria);

    expect(component.filteredData.length).toBe(0);
    expect(component.filterResponse.success).toBeFalse();
  });

  it('should load categories', () => {
    component.onCategoriesLoaded(mockCategories);
    expect(component.categories).toEqual(mockCategories);
  });

  // Pruebas para getCategoryName
  it('should return category name if found', () => {
    component.onCategoriesLoaded(mockCategories);
    const categoryName = component.getCategoryName('1');
    expect(categoryName).toBe('Category 1');
  });

  it('should return "Categoría no encontrada" if category not found', () => {
    component.onCategoriesLoaded(mockCategories);
    const categoryName = component.getCategoryName('3');
    expect(categoryName).toBe('Categoría no encontrada');
  });

  // Pruebas para goToPage
  it('should set currentPage if page is valid', () => {
    component.goToPage(1);
    expect(component.currentPage).toBe(1);
  });

  it('should not change currentPage if page is invalid', () => {
    const initialPage = component.currentPage;
    component.goToPage(0);
    
    expect(component.currentPage).toBe(initialPage);
  });


  it('should not change currentPage if page is out of range', () => {
    component.currentPage = 2;
    component.goToPage(5);
    expect(component.currentPage).toBe(2);
  });

  // Pruebas para totalPages
  it('should return correct total pages', () => {
    component.filteredData = mockData;
    component.itemsPerPage = 2;
    expect(component.totalPages()).toBe(2);
  });

  // Pruebas para getPages
  it('should return correct page numbers', () => {
    component.filteredData = mockData;
    component.itemsPerPage = 2;
    expect(component.getPages()).toEqual([1, 2]);
  });

  // Pruebas para paginatedData
  it('should return paginated data', () => {
    component.filteredData = mockData;
    component.itemsPerPage = 2;
    component.currentPage = 1;
    const paginatedItems = component.paginatedData();
    expect(paginatedItems.length).toBe(2);
    expect(paginatedItems[0].name).toBe('Item 1');
  });
});
