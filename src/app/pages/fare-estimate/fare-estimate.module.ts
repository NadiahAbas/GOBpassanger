
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FareEstimatePage } from './fare-estimate.page';

const routes: Routes = [
  {
    path: '',
    component: FareEstimatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FareEstimatePage]
})
export class FareestimatePageModule { }
