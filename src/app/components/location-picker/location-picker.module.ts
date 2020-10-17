import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocationPickerComponent } from './location-picker.component';

const routes: Routes = [
  {
    path: '/picker',
    component: LocationPickerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LocationPickerComponent],
  exports: [LocationPickerComponent]
})
export class LocationPickerModule { }
