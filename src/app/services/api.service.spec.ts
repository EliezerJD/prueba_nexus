import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service'; // Ajusta la ruta

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importa HttpClientTestingModule aquí
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController); // Inyecta HttpTestingController
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Verifica que el servicio se crea correctamente
  });

  it('should fetch categories from API', () => {
    const mockCategories = [{ id: 1, name: 'Categoría 1' }, { id: 2, name: 'Categoría 2' }];

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories); // Verifica que los datos recibidos son los esperados
    });

    const req = httpMock.expectOne('https://670eee583e7151861656249c.mockapi.io/nexion-api/v1//Categories');
    expect(req.request.method).toBe('GET'); // Verifica que se utiliza el método GET
    req.flush(mockCategories); // Devuelve los datos simulados
  });

  it('should fetch data from API', () => {
    const mockData = [{ id: 1, title: 'Artículo 1' }, { id: 2, title: 'Artículo 2' }];

    service.getData().subscribe((data) => {
      expect(data).toEqual(mockData); // Verifica que los datos recibidos son los esperados
    });

    const req = httpMock.expectOne('https://670eee583e7151861656249c.mockapi.io/nexion-api/v1//Articles');
    expect(req.request.method).toBe('GET'); // Verifica que se utiliza el método GET
    req.flush(mockData); // Devuelve los datos simulados
  });
});
