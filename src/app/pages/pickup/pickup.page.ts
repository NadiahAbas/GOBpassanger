
import { Component, OnInit } from '@angular/core';
import { RideService } from '@app/services/ride/ride.service';
import { Router } from '@angular/router';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { APIService } from '@app/services/api/api.service';
import { Ride } from '@app/models/ride';
import { environment } from '@env/environment';
import { UtilService } from '@app/services/util/util.service';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.page.html',
  styleUrls: ['./pickup.page.scss']
})
export class PickupPage implements OnInit {
  public zoom = 8;
  public screenOptions;
  public rideId;
  public listenerId;
  public origin: { lat: any; lng: any; };
  public destination: { lat: any; lng: any; };

  constructor(
    public rideService: RideService,
    private route: Router,
    private userProvider: InitUserProvider,
    private api: APIService,
    private util: UtilService
  ) { }

  async ngOnInit() {
    this.setRideStatusListener();
    this.rideId = await this.userProvider.getRideId();
  }

  setRideStatusListener() {
    this.listenerId = setInterval(() => {
      this.checkRideStatus();
    }, 7000);
  }

  clearRideStatusListener() {
    clearInterval(this.listenerId);
    this.listenerId = null;
  }

  async checkRideStatus() {
    console.log('status check.....');
    const user = this.userProvider.getUserData();
    this.api.getRide(user.rideId).subscribe((ride: Ride) => {
      Object.assign(this.rideService.rideInfo, ride);
      if (ride['ride_completed']) {
        this.clearRideStatusListener();
        this.showCompletedRideAlert();
      } else if (ride['driver_rejected']) {
        this.clearRideStatusListener();
        this.showDriverRejectedAlert();
      } else if (ride['ride_started']) {
        console.log('ride started');
      } else {
        console.log('waiting for response from driver'); // TODO
      }
    });

  }

  cancelRide() {
    this.showUserCanceledRideAlert();
  }

  async showDriverRejectedAlert() {

    const cancelAlert = await this.util.createAlert(
      'Sorry!',
      false,
      environment.DRIVER_REJECTED_MSG,
      {
        text: 'Ok',
        role: 'cancel',
        cssClass: 'gob',
        handler: async () => {
          this.rideService.resetRideSettings();
          this.util.goToNew('/home');
        }
      }
    );
    await cancelAlert.present();

  }

  async showCompletedRideAlert() {

    const completeAlert = await this.util.createAlert(
      'Yay!',
      false,
      environment.RIDE_COMPLETED_MSG,
      {
        text: 'Ok',
        role: 'cancel',
        cssClass: 'gob',
        handler: async () => {
          this.rideService.resetRideSettings();
          this.util.goToNew('/home');
        }
      }
    );
    await completeAlert.present();

  }

  async showUserCanceledRideAlert() {

    const cancelAlert = await this.util.createAlert(
      'Cancel Ride ?',
      false,
      environment.USER_CANCEL_MSG,
      {
        text: 'Ok',
        role: 'cancel',
        cssClass: 'gob',
        handler: async () => {
          this.api.setRideRejected(this.rideId).subscribe(res => {
            this.rideService.resetRideSettings();
            this.clearRideStatusListener();
            this.util.goToNew('/home');
          }, err => console.log(err));

        }
      }
    );
    await cancelAlert.present();

  }

  stars(number) {
    return Array(number).fill(0);
  }

  ionViewWillLeave() {
    this.clearRideStatusListener();
  }


paypal(){
  this.util.goBack('/addcard');
}
}

