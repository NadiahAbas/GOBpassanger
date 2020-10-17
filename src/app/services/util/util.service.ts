
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { environment } from '@env/environment';

declare let google;

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private statusBar: StatusBar,
    private geolocation: Geolocation,
    private navCtrl: NavController,

  ) {
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword(password) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(password).toLowerCase());
  }

  
  goToNew(route) {
    this.navCtrl.navigateRoot(route);
  }

  goBack(route) {
    this.navCtrl.navigateBack(route);
  }

  goForward(route) {
    this.navCtrl.navigateForward(route);
  }

  async createAlert(header, backdropDismiss, message, buttonOptions1, buttonOptions2?): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create({
      header,
      backdropDismiss,
      message,
      buttons: !buttonOptions2 ? [buttonOptions1] : [buttonOptions1, buttonOptions2]
    });
    return alert;
  }

  async createLoader(message): Promise<HTMLIonLoadingElement> {
    const loader = await this.loadingCtrl.create({
      message
    
    });
    return loader;
  }

  async createToast(message, showCloseButton = false, position = 'bottom' as 'top' | 'bottom' | 'middle', duration = 2000): Promise<HTMLIonToastElement> {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
      buttons: [{
        text: 'Done',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    return toast;
  }

  async createModal(component, componentProps?, cssClass?): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create({
      component,
      cssClass,
      componentProps
    });
    return modal;
  }

  async createActionSheet(button1, button2?, button3?) {
    const sheet = await this.actionSheetCtrl.create({
      buttons: [button1, button2, button3]
    });

    return sheet;
  }


  latLngConverterSQL(locations) {
    return locations.map(location => {
      location.origin = { lat: location.origin_lat, lng: location.origin_lng };
      location.destination = { lat: location.destination_lat, lng: location.destination_lng };
      return location;
    });
  }


  async getCurrentLatLng() {
    const { coords } = await this.geolocation.getCurrentPosition();
    return coords;
  }

  async getGooglePlaceAutoCompleteList(searchText, geolocation, country) {
    const service = new window['google'].maps.places.AutocompleteService();
    let pred;
   
    await new Promise((resolve, reject) => {
      service.getPlacePredictions({
        input: searchText,
        componentRestrictions: { country: country || environment.COUNTRY }
      }, (predictions) => {
        pred = predictions;
        resolve(true);
      });
    });
    return pred;
  }


  async getGeoCodedAddress(lat: number, lng: number) {
    let block, street, building, country;
    console.log('getGeoL');

    if (navigator.geolocation) {
      const geocoder = await new google.maps.Geocoder();
      const latlng = await new google.maps.LatLng(lat, lng);
      const request = { latLng: latlng };

      await new Promise((resolve, reject) => {

        geocoder.geocode(request, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const result = results[0];
            const rsltAdrComponent = result.address_components;
            if (result !== null) {
              if (rsltAdrComponent[0] !== null) {
                block = rsltAdrComponent[0].long_name;
                street = rsltAdrComponent[2].short_name;
                building = rsltAdrComponent[1].short_name;
              }
              
              console.log(rsltAdrComponent);
             
              let local_add_1 = '';
              let local_add_2 = '';
              for (let i = 0; i < rsltAdrComponent.length; i++) {
                if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('country')) {
                  country = rsltAdrComponent[i].short_name;
                }
                if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('administrative_area_level_1')) {
                  local_add_1 = rsltAdrComponent[i].short_name;
                }
                if (rsltAdrComponent[i].types && rsltAdrComponent[i].types.includes('locality')) {
                  local_add_2 = rsltAdrComponent[i].short_name;
                }
              }
              
              resolve(true);
              console.log('block resolved');

            } else {
              alert('No address available!');
            }
          }

        });
      });
    }
    return { block, street, building, country };

  }

  changeStatusBarColor() {
    this.statusBar.backgroundColorByHexString('#000');
  }

}
