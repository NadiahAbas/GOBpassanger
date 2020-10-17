
import { Component, OnInit } from '@angular/core';
import { RideService } from '@app/services/ride/ride.service';
import { APIService } from '@app/services/api/api.service';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { environment } from '@env/environment';
import { User } from '@app/models/user';
import { Ride } from '@app/models/ride';
import { UtilService } from '@app/services/util/util.service';


@Component({
  selector: 'app-requestride',
  templateUrl: './request-ride.page.html',
  styleUrls: ['./request-ride.page.scss']
})
export class RequestRidePage implements OnInit {
  public lat: number;
  public lng: number;
  public loggedInUser: User;
  public zoom: number;
  public markerOptions = environment.MARKER_OPTIONS;
  public screenOptions;

  constructor(
    public rideService: RideService,
    private userProvider: InitUserProvider,
    private api: APIService,
    private util: UtilService
  ) {
    this.lat = this.rideService.direction_lat;
    this.lng = this.rideService.direction_lng;
  }

  ngOnInit() {

    // to redirect to further pages if a booking is active //TODO
    this.loggedInUser = this.userProvider.getUserData();
    if (this.loggedInUser) {
      if (this.loggedInUser['ride_started'] === true) {
        this.util.goToNew('/bookingconfirmation');
      }
    }
  }

  async alertOnSubmit() {

    const alert = await this.util.createAlert(
      'Confirm Booking',
      false,
      environment.USER_CONFIRM_MSG,
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'gob',
        handler: res => {
          console.log('Cancel booking');
          this.util.goToNew('/home');
        }
      }, {
      text: 'Book',
      handler: async () => {
        const rideId = await this.userProvider.getRideId();
        if (rideId) {
          console.log('send to booked ride', rideId);
        } else {
          this.bookRide();
        }
      }
    }
    );

    await alert.present();
  }

  async bookRide() {
    const loading = await this.util.createLoader('Connecting you to drivers ...');
    await loading.present();

    const rideData: Ride = {
      id: null,
      origin_lat: this.rideService.origin.lat,
      origin_lng: this.rideService.origin.lng,
      destination_lat: this.rideService.destination.lat,
      destination_lng: this.rideService.destination.lng,
      taxi_type: this.rideService.taxiType,
      driver_rejected: false,
      request_timeout: false,
      ride_accepted: false,
      ride_started: false,
      user_rejected: false,
      ride_completed: false,
      fare: this.rideService.getFare(),
      clientId: this.loggedInUser.id,
      driverId: null,
      distance: this.rideService.tripDistance,
    };

    this.api.bookRide(rideData)
      .subscribe(async (ride: Ride) => {
        loading.dismiss();
        console.log('ride', ride);
        this.rideService.setRideInfo(ride);
      });
  }
}

