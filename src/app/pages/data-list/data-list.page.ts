import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FilterComponent } from '../../components/filter/filter.component';
import { ApiService } from '../../services/api.service';
import { FilterService } from '../../services/filter.service';
import { Category } from '../../models/category.model';
import { Item } from '../../models/item.model';
import { HttpClientModule } from '@angular/common/http';

interface FilterResponse {
  success: boolean;
  message: string;
  filteredData: Item[];
}

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.page.html',
  styleUrls: ['./data-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FilterComponent, HttpClientModule]
})
export class DataListPage implements OnInit {

  data: Item[] = [];
  filteredData: Item[] = [];
  categories: Category[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math = Math;
  filterResponse: FilterResponse = { success: true, message: '', filteredData: [] };

  constructor(private apiService: ApiService, private filterService: FilterService) {}

  ngOnInit() {
    this.apiService.getData().subscribe((response) => {
      this.data = response;
      this.filteredData = response;
      this.filterResponse = {
        success: true,
        message: `Se encontraron ${response.length} resultados.`,
        filteredData: response
      };
    }, (error) => {
      console.error('Error al obtener los datos:', error);
    });

    this.filterService.filter.subscribe(data => {
      this.filterData(data);
    });
  }

  filterData(data: { searchTerm: string; startDate: string; endDate: string; categories: string[]; }) {
    if (!data.searchTerm && !data.startDate && !data.endDate && data.categories.length === 0) {
      this.filteredData = [...this.data];
      this.filterResponse = {
        success: true,
        message: `Se encontraron ${this.data.length} resultados.`,
        filteredData: this.data
      };
      return;
    }

    this.filteredData = this.data.filter(item => {
      const matchesSearchTerm = item.name.toLowerCase().includes(data.searchTerm.toLowerCase());
      const matchesStartDate = !data.startDate || new Date(item.createdAt) >= new Date(data.startDate);
      const matchesEndDate = !data.endDate || new Date(item.createdAt) <= new Date(data.endDate);
      const matchesCategory = data.categories.length === 0 || data.categories.includes(String(item.CategoryId));

      return matchesSearchTerm && matchesStartDate && matchesEndDate && matchesCategory;
    });

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

  onCategoriesLoaded(categories: Category[]) {
    this.categories = categories;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoría no encontrada';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  paginatedData(): Item[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
