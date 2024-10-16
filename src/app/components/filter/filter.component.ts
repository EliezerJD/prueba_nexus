import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CategoryErrorPipe } from '../../pipes/category-error.pipe';
import { FilterService } from '../../services/filter.service';
import { Category } from '../../models/category.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [IonContent, ReactiveFormsModule, CommonModule, CategoryErrorPipe, HttpClientModule]
})
export class FilterComponent implements OnInit {

  @Output() categoriesLoaded = new EventEmitter<Category[]>(); // Emite el evento cuando las categorías han sido cargadas
  filterForm: FormGroup; // Formulario reactivo para gestionar los filtros
  isFiltersVisible: boolean = true; // Controla la visibilidad de los filtros
  categories: Category[] = []; // Almacena las categorías disponibles
  errorMessage: string = ''; // Mensaje de error en caso de fallo en la carga

  constructor(private apiService: ApiService, private filterService: FilterService) { 
    this.filterForm = this.createForm(); // Inicializa el formulario
  }

  ngOnInit() {
    // Suscribe a la obtención de categorías desde el servicio API
    this.apiService.getCategories().subscribe((response: Category[]) => {
      this.categories = response; // Asigna las categorías recibidas
      this.categoriesLoaded.emit(this.categories); // Emite las categorías cargadas
    }, (error) => {
      console.error('Error al obtener los datos:', error); // Manejo de error en la obtención de las categorías
    });
  }

  toggleFiltersVisibility(): void {
    this.isFiltersVisible = !this.isFiltersVisible; // Alterna la visibilidad del panel de filtros
  }

  toggleCategory(categoryId: string): void {
    const categoriesArray = this.filterForm.get('categories') as FormArray;
    const index = categoriesArray.controls.findIndex(control => control.value === categoryId);

    // Añade o elimina la categoría seleccionada del FormArray
    if (index === -1) {
      categoriesArray.push(new FormControl(categoryId)); // Añade si no está seleccionada
    } else {
      categoriesArray.removeAt(index); // Elimina si ya está seleccionada
    }
  }

  applyFilters(): void {
    // Aplica los filtros actuales usando el servicio de filtros
    this.filterService.setFilter(this.filterForm.value);
  }

  clearFilters(): void {
    this.filterForm = this.createForm(); // Resetea el formulario de filtros
    this.applyFilters(); // Aplica los filtros reseteados
  }

  isCategorySelected(categoryId: string): boolean {
    // Verifica si la categoría ya está seleccionada
    return (this.filterForm.get('categories') as FormArray).controls.some(control => control.value === categoryId);
  }

  createForm(): FormGroup {
    // Crea el formulario con los campos de búsqueda y categorías
    return new FormGroup({
      searchTerm: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      categories: new FormArray([])
    });
  }
}