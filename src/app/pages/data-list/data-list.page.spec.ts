import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataListPage } from './data-list.page'; // Ajusta la ruta según tu estructura

describe('DataListPage', () => {
  let component: DataListPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DataListPage], // Asegúrate de importar HttpClientTestingModule aquí
    });

    const fixture = TestBed.createComponent(DataListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
