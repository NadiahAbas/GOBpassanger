
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIService } from '../api/api.service';
import { environment } from '@env/environment';
import { UtilService } from '../util/util.service';
import { PaymentComponent } from '@app/components/payment/payment.component';
import { InitUserProvider } from '../inituser/inituser.service';
import { Driver } from '@app/models/driver';
import { Ride } from '@app/models/ride';
declare let google;

@Injectable({
  providedIn: 'root'
})
export class RideService {
  public zoom = 15;
  public originAddress = null;
  public destinationAddress = null;
  public tripDistance;
  public locatedCountry = environment.COUNTRY;
  public locationType = 'pickup';
  public origin;
  public destination;
  public direction_lat; 
  public direction_lng;
  public farePerKm = 0.75;
  public timePerKm = 5;
  public driverInfo: Driver;
  public rideInfo: Ride;
  public markerOptions = environment.MARKER_OPTIONS;
  public renderOptions = environment.RENDER_OPTIONS;
  public screenOptions = environment.SCREEN_OPTIONS;
  public taxiType;
  public carImage;
  public mapStyle = environment.MAP_STYLE;
  public key = environment.GOOGLE_MAPS_API_KEY;
  public path: any;

  constructor(
    private api: APIService,
    private __zone: NgZone,
    private http: HttpClient,
    private util: UtilService,
    private userProvider: InitUserProvider
  ) {
    this.driverInfo = {
      id: null,
      token: '',
      email: '',
      password: '',
      approved: false,
      available: false,
      location_lat: null,
      location_lng: null,
      dob: '',
      gender: '',
      name: '',
      phone: '',
      img: '',
      car_model: '',
      car_number: '',
    };
    this.rideInfo = {
      id: null,
      origin_lat: null,
      origin_lng: null,
      destination_lat: null,
      destination_lng: null,
      distance: null,
      fare: null,
      clientId: null,
      driverId: null,
      driver_rejected: false,
      ride_started: false,
      ride_accepted: false,
      user_rejected: false,
      ride_completed: false,
      request_timeout: false,
      taxi_type: ''
    };
  }

  getLatLan(address: string): Observable<any> {
    const geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      geocoder.geocode({ address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          observer.next(results[0].geometry.location);
          observer.complete();
        } else {
          console.log('Error - ', results, ' & Status - ', status);
          observer.next({ err: true });
          observer.complete();
        }
      });
    });
  }

  getOrigin(rideInfo) {
    return new Promise(resolve => {
      this.http
        .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          rideInfo.origin.lat
          }, ${rideInfo.origin.lng}&key=${this.key}`)
        .subscribe(res => {
          resolve(res);
        });
    });
  }

  getDestination(rideInfo) {
    return new Promise(resolve => {
      this.http
        .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          rideInfo.destination.lat
          }, ${rideInfo.destination.lng}&key=${this.key}`)
        .subscribe(res => {
          resolve(res);
        });
    });
  }
  async setRideInfo(ride) {
    Object.assign(this.rideInfo, ride);
    await this.setAddress({ lat: ride.origin_lat, lng: ride.origin_lng }, 'pickup');
    await this.setAddress({ lat: ride.destination_lat, lng: ride.destination_lng }, 'destination');
    await this.userProvider.setRideId(ride.id);
    if (ride.driverId) {
      this.api.getDriver(ride.driverId).subscribe(
        driver => {
          Object.assign(this.driverInfo, driver);
          this.util.goToNew('/bookingconfirmation');
        },
        err => console.log(err)
      );
    } else {
      this.util.goToNew('/bookingconfirmation');
    }

  }

  checkIfExistingRide(rideId) {
    this.api.getRide(rideId).subscribe(async ride => {
      console.log(ride);
      if (ride && !ride['ride_completed'] && !ride['driver_rejected'] && !ride['user_rejected'] && !ride['request_timeout']) {
        this.setRideInfo(ride);
      } else {
        console.log('clear', rideId);
        await this.userProvider.clearRideId();
      }
    }, err => console.log(err));
  }

  resetRideSettings() {
    this.locationType = 'pickup';
    this.destinationAddress = null;
    this.destination = null;
  }

  updateUserLocation(id, lat, lng) {
    this.api.updateUser(id, { location_lat: lat, location_lng: lng })
      .subscribe(res => {
        console.log('location saved', res);
      }, err => console.log(err));
  }

  async setAddress(location, locationType) {
    const address = await this.util.getGeoCodedAddress(location.lat, location.lng);
    if (locationType === 'pickup') {
      this.origin = location;
      this.originAddress = `${address.block} ${address.street} ${address.building}`;
      return this.originAddress;
    }
    if (locationType === 'destination') {
      this.destination = location;
      this.destinationAddress = `${address.block} ${address.street} ${address.building}`;
      return this.destinationAddress;

    }
  }


  async selectTaxiType(name, image) {
    if (!this.destinationAddress) {
      const toast: any = await this.util.createToast(environment.SELECT_DESTINATION_WARN, false, 'bottom', 3000);
      await toast.present();
    } else if (!this.originAddress) {
      const toast: any = await this.util.createToast(environment.SELECT_ORIGIN_WARN, false, 'bottom', 3000);
      await toast.present();
    } else {
      this.taxiType = name;
      this.carImage = image;
      const profileModal: any = await this.util.createModal(PaymentComponent, { taxiType: this.taxiType, carImage: this.carImage }, 'backTransparent');
      await profileModal.present();
    }
  }

  getFare(): number {
    return Math.round(this.tripDistance * this.farePerKm);
  }

  getTripTime(): number {
    return Math.round(this.tripDistance) * this.timePerKm;
  }

}
