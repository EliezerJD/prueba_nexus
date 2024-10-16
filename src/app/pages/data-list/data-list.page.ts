import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FilterComponent } from '../../components/filter/filter.component';
import { ApiService } from '../../services/api.service';
import { FilterService } from '../../services/filter.service';
import { Category } from '../../models/category.model';
import { Item } from '../../models/item.model';
import { Filter } from '../../models/filter.model';
import { HttpClientModule } from '@angular/common/http';

interface FilterResponse {
  success: boolean; // Indica si la operación fue exitosa
  message: string;  // Mensaje informativo
  filteredData: Item[]; // Datos filtrados
}

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.page.html',
  styleUrls: ['./data-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FilterComponent, HttpClientModule]
})
export class DataListPage implements OnInit {

  data: Item[] = []; // Datos originales obtenidos de la API
  filteredData: Item[] = []; // Datos que serán mostrados después de aplicar filtros
  categories: Category[] = []; // Lista de categorías para filtrar
  currentPage: number = 1; // Página actual para la paginación
  itemsPerPage: number = 5; // Cantidad de items por página
  Math = Math; // Permite usar Math en la plantilla
  filterResponse: FilterResponse = { success: true, message: '', filteredData: [] }; // Respuesta del filtro

  constructor(private apiService: ApiService, private filterService: FilterService) {}

  ngOnInit() {
    // Obtiene datos de la API al inicializar el componente
    this.apiService.getData().subscribe((response) => {
      this.data = response; // Almacena los datos originales
      this.filteredData = response; // Inicialmente, los datos filtrados son los mismos que los originales
      this.filterResponse = {
        success: true,
        message: `Se encontraron ${response.length} resultados.`,
        filteredData: response
      };
    }, (error) => {
      console.error('Error al obtener los datos:', error); // Manejo de errores al obtener datos
    });

    // Suscribe a los cambios de los filtros
    this.filterService.filter.subscribe(data => {
      this.filterData(data); // Llama a filterData con los nuevos filtros
    });
  }

  filterData(data: Filter) {
    // Si no hay filtros aplicados, muestra todos los datos
    if (!data.searchTerm && !data.startDate && !data.endDate && data.categories.length === 0) {
      this.filteredData = [...this.data]; // Copia todos los datos a los datos filtrados
      this.filterResponse = {
        success: true,
        message: `Se encontraron ${this.data.length} resultados.`,
        filteredData: this.data
      };
      return;
    }

    // Filtra los datos según los criterios especificados
    this.filteredData = this.data.filter(item => {
      const matchesSearchTerm = item.name.toLowerCase().includes(data.searchTerm.toLowerCase()); // Coincidencia del término de búsqueda
      const matchesStartDate = !data.startDate || new Date(item.createdAt) >= new Date(data.startDate); // Coincidencia de la fecha de inicio
      const matchesEndDate = !data.endDate || new Date(item.createdAt) <= new Date(data.endDate); // Coincidencia de la fecha de fin
      const matchesCategory = data.categories.length === 0 || data.categories.includes(String(item.CategoryId)); // Coincidencia de categorías

      // Devuelve verdadero solo si el item cumple con todos los criterios
      return matchesSearchTerm && matchesStartDate && matchesEndDate && matchesCategory;
    });

    // Actualiza la respuesta del filtro según el resultado de la filtración
    if (this.filteredData.length > 0) {
      this.filterResponse = {
        success: true,
        message: `Se encontraron ${this.filteredData.length} resultados.`,
        filteredData: this.filteredData
      };
    } else {
      this.filterResponse = {
        success: false,
        message: 'No se encontraron resultados con los filtros aplicados.',
        filteredData: []
      };
    }
  }

  // Método llamado cuando se cargan las categorías
  onCategoriesLoaded(categories: Category[]) {
    this.categories = categories; // Almacena las categorías cargadas
  }

  // Devuelve el nombre de la categoría dado su ID
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId); // Busca la categoría por ID
    return category ? category.name : 'Categoría no encontrada'; // Retorna el nombre o un mensaje de error
  }

  // Cambia a la página especificada si es válida
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page; // Actualiza la página actual
    }
  }

  // Calcula el total de páginas para la paginación
  totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage); // Redondea hacia arriba el número de páginas
  }

  // Genera un arreglo con los números de las páginas
  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1); // Crea un arreglo de números de páginas
  }

  // Devuelve los datos paginados según la página actual
  paginatedData(): Item[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage; // Calcula el índice inicial para la paginación
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage); // Retorna solo los datos de la página actual
  }
}
