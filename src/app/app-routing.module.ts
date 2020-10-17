import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },

  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'home/:status',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  
  { path: 'loginPage', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'resetPassword', loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule) },
  { path: 'addcard', loadChildren: () => import('./pages/add-card/add-card.module').then(m => m.AddcardPageModule) },
  { path: 'ride-details', loadChildren: () => import('./pages/ride-details/ride-details.module').then(m => m.RideDetailsModule) },
  { path: 'history', loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule) },
  { path: 'pickup', loadChildren: () => import('./pages/pickup/pickup.module').then(m => m.PickupPageModule) },
  { path: 'fareestimate', loadChildren: () => import('./pages/fare-estimate/fare-estimate.module').then(m => m.FareestimatePageModule) },
  { path: 'requestride', loadChildren: () => import('./pages/request-ride/request-ride.module').then(m => m.RequestridePageModule) },
  { path: 'changepayment', loadChildren: () => import('./pages/change-payment/change-payment.module').then(m => m.ChangepaymentPageModule) },
  { path: 'profilepage', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilepagePageModule) },
  { path: 'bookingconfirmation', loadChildren: () => import('./pages/booking-confirmation/booking-confirmation.module').then(m => m.BookingconfirmationPageModule) },
  {
    path: 'payment',
    loadChildren: () => import('./components/payment/payment.module').then(m => m.PaymentModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/setting/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'term',
    loadChildren: () => import('./term/term.module').then( m => m.TermPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./verify/verify.module').then( m => m.VerifyPageModule)
  },
  {
    path: 'aboutus',
    loadChildren: () => import('./aboutus/aboutus.module').then( m => m.AboutusPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'emergency',
    loadChildren: () => import('./emergency/emergency.module').then( m => m.EmergencyPageModule)
  },
  {
    path: 'driver-profile',
    loadChildren: () => import('./driver-profile/driver-profile.module').then( m => m.DriverProfilePageModule)
  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
