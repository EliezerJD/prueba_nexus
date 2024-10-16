// Importación de módulos y componentes necesarios desde Angular e Ionic.
import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CategoryErrorPipe } from '../../pipes/category-error.pipe';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [IonContent, ReactiveFormsModule, CommonModule, CategoryErrorPipe]
})
export class FilterComponent implements OnInit {

  // Declaración de propiedades del componente.
  filterForm: FormGroup; // FormGroup para gestionar el formulario de filtros.
  isFiltersVisible: boolean = true; // Estado que indica si los filtros son visibles.
  categories: string[] = []; // Array para almacenar categorías obtenidas de la API.
  errorMessage: string = ''; // Mensaje de error, inicializado vacío.
  selectedCategories: string[] = []; // Array para almacenar las categorías seleccionadas.

  constructor(private apiService: ApiService) { // Se inyecta el ApiService
    // Inicializa el formulario de filtros con controles específicos.
    this.filterForm = new FormGroup({
      searchTerm: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });
  }

  ngOnInit() {
    // Llama al servicio para obtener categorías y suscribirse a los resultados.
    this.apiService.getCategories().subscribe((response) => {
      this.categories = response; // Almacena las categorías en la propiedad correspondiente.
    }, (error) => {
      console.error('Error al obtener los datos:', error); // Manejo de errores al obtener datos.
    });
  }

  toggleFiltersVisibility(): void { // Método para alternar la visibilidad de los filtros.
    this.isFiltersVisible = !this.isFiltersVisible; // Cambia el estado de visibilidad.
  }

  toggleCategory(category: string): void { // Método para alternar la selección de categorías.
    const index = this.selectedCategories.indexOf(category); // Busca la categoría en las seleccionadas.
    if (index === -1) { // Si la categoría no está seleccionada,
      this.selectedCategories.push(category); // la añade al array.
    } else {
      this.selectedCategories.splice(index, 1); // Si está seleccionada, la elimina del array.
    }
  }

  applyFilters(): void { // Método para aplicar filtros 
  
  }

  clearFilters(): void { // Método para limpiar los filtros.
    // Reinicia los valores del formulario y las categorías seleccionadas.
    this.filterForm.get('searchTerm')?.setValue('');
    this.filterForm.get('startDate')?.setValue('');
    this.filterForm.get('endDate')?.setValue('');
    this.selectedCategories = [];
  }

}
