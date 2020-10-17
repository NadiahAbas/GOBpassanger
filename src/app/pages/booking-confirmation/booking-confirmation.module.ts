
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProgressBarModule } from 'angular-progress-bar'
import { BookingConfirmationPage } from './booking-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: BookingConfirmationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ProgressBarModule
  ],
  declarations: [BookingConfirmationPage]
})
export class BookingconfirmationPageModule { }
