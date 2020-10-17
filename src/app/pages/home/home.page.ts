
import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { RideService } from '@app/services/ride/ride.service';
import { PaymentComponent } from '@app/components/payment/payment.component';
import { ActivatedRoute } from '@angular/router';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { UtilService } from '@app/services/util/util.service';
import { environment } from '@env/environment';
import { User } from '@app/models/user';
import { Marker } from '@app/models/marker';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})

export class HomePage implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef;
  public loggedInUser: User;
  public lat = 37.7749;
  public lng = -122.4194;
  public color = ['black', 'black', 'black'];
  public items = [{}, {}, {}];

  constructor(
    private __zone: NgZone,
    public rideService: RideService,
    private userProvider: InitUserProvider,
    private route: ActivatedRoute,
    private util: UtilService
  ) {
    this.getCurrentLocation();

  }

  async ngOnInit() {
    const rideId = await this.userProvider.getRideId();
    if (rideId) {
      this.rideService.checkIfExistingRide(rideId);
    }
    this.loggedInUser = this.userProvider.getUserData();
  }

  async getCurrentLocation() {
    const loader = await this.util.createLoader('Getting your location..');
    await loader.present();
    const coords = await this.util.getCurrentLatLng();
    this.lat = coords.latitude;
    this.lng = coords.longitude;
    this.rideService.setAddress({ lat: this.lat, lng: this.lng }, this.rideService.locationType);
    this.rideService.updateUserLocation(this.loggedInUser.id, this.lat, this.lng);
    this.rideService.locationType = 'destination';
    loader.dismiss();
  }

  changeStyle(j) {
    for (const it of this.items) {
      it['background-color'] = 'rgba(128, 128, 128, 0.22)';
    }
    this.items[j]['background-color'] = '#53bfe9';
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  async markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
    if ($event.coords && $event.coords.lat && $event.coords.lng) {
      this.rideService.setAddress({ lat: $event.coords.lat, lng: $event.coords.lng }, this.rideService.locationType);
    }
  }

  async onChange(event: any) {
    const originLocation = event.request.origin.location;
    const destinationLocation = event.request.destination.location;

    const origin = { lat: originLocation.lat(), lng: originLocation.lng() };
    const destination = { lat: destinationLocation.lat(), lng: destinationLocation.lng() };

    if (origin.lat !== this.rideService.origin.lat || origin.lng !== this.rideService.origin.lng) {
      console.log('origin changed', origin);
      this.rideService.setAddress(origin, 'pickup');
      Object.assign(this.rideService.origin, origin);
    }
    if (destination.lat !== this.rideService.destination.lat || destination.lng !== this.rideService.destination.lng) {
      console.log('destination changed', destination);
      this.rideService.setAddress(destination, 'destination');
      Object.assign(this.rideService.destination, destination);
    }
    this.rideService.tripDistance = Math.round(event.routes[0].legs[0].distance.value / 1000);

  }

  emergency(){
    this.util.goForward('/emergency');
  }
}

