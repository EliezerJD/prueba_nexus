import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //La url debería estar en una variable de entorno, pero para efectos de prácticos para la persona que ejecute el proyecto lo dejaré estático.
  private apiUrl = 'https://670eee583e7151861656249c.mockapi.io/nexion-api/v1/';

  constructor(private http: HttpClient) { }

  // Método para obtener las categorías
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Categories`);
  }
  // Método para obtener los artículos
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Articles`);
  }
}
