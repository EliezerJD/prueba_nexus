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

  @Output() categoriesLoaded = new EventEmitter<Category[]>();
  filterForm: FormGroup;
  isFiltersVisible: boolean = true; 
  categories: Category[] = []; 
  errorMessage: string = ''; 

  constructor(private apiService: ApiService, private filterService: FilterService) { 
    this.filterForm = this.createForm();
  }

  ngOnInit() {
    this.apiService.getCategories().subscribe((response: Category[]) => {
      this.categories = response; 
      this.categoriesLoaded.emit(this.categories);
    }, (error) => {
      console.error('Error al obtener los datos:', error); 
    });
  }

  toggleFiltersVisibility(): void {
    this.isFiltersVisible = !this.isFiltersVisible; 
  }

  toggleCategory(categoryId: string): void {
    const categoriesArray = this.filterForm.get('categories') as FormArray;
    const index = categoriesArray.controls.findIndex(control => control.value === categoryId);

    if (index === -1) {
      categoriesArray.push(new FormControl(categoryId));
    } else {
      categoriesArray.removeAt(index);
    }
  }

  applyFilters(): void {
    this.filterService.setFilter(this.filterForm.value);
  }

  clearFilters(): void {
    this.filterForm = this.createForm();
    this.applyFilters();
  }

  isCategorySelected(categoryId: string): boolean {
    return (this.filterForm.get('categories') as FormArray).controls.some(control => control.value === categoryId);
  }

  createForm(): FormGroup {
    return new FormGroup({
      searchTerm: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      categories: new FormArray([])
    });
  }
}
