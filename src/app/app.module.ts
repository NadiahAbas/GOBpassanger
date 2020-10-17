
import { NgModule, NO_ERRORS_SCHEMA, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { AgmCoreModule } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentComponent } from '@app/components/payment/payment.component';
import { SetLocationComponent } from '@app/components/set-location/set-location.component';
import { RideDetailsPage } from '@app/pages/ride-details/ride-details.page';
import { AgmDirectionModule } from 'agm-direction';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '@env/environment';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { StorageService } from '@app/services/api/firestorage.service';
import { AuthenticationService } from '@app/services/api/firebase-authentication.service';
import { FirestoreService } from '@app/services/api/firestore.service';
import { APIService } from './services/api/api.service';
import { PayPal } from '@ionic-native/paypal/ngx';
import { Media } from '@ionic-native/media/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { SMS } from '@ionic-native/sms/ngx';


@NgModule({
  declarations: [
    AppComponent,
    PaymentComponent,
    SetLocationComponent,
    RideDetailsPage
  ],
  entryComponents: [
    PaymentComponent,
    SetLocationComponent,
    RideDetailsPage
  ],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({ name: environment.IONIC_STORAGE }),
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAPS_API_KEY,
      libraries: ['places', 'geometry']
    }),
    ReactiveFormsModule,
    AgmDirectionModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  providers: [
    FileTransfer,
    File,
    Camera,
    StatusBar,
    Geolocation,
    SplashScreen,
    PayPal,
    Media,
    SMS,
    AuthenticationService,
    FirestoreService,
    APIService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InitUserProvider,
    StorageService,
    { provide: APP_INITIALIZER, useFactory: initUserProviderFactory, deps: [InitUserProvider], multi: true },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initUserProviderFactory(provider: InitUserProvider) {
  return () => provider.load();
}
