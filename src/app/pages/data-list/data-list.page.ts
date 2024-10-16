import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FilterComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.page.html',
  styleUrls: ['./data-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FilterComponent]
})
export class DataListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
