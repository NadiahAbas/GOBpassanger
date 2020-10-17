import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { APIService } from '@app/services/api/api.service';
import { environment } from '@env/environment';
import { Ride } from '@app/models/ride';
import { UtilService } from '@app/services/util/util.service';
import { RideService } from '@app/services/ride/ride.service';
import { User } from '@app/models/user';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.page.html',
  styleUrls: ['./booking-confirmation.page.scss']
})
export class BookingConfirmationPage {
  public progress = 10;
  public loader: HTMLIonLoadingElement;
  public loaderListenerId;
  public timeoutListenerId;
  public delayAlert: HTMLIonAlertElement;
  public cancelAlert: HTMLIonAlertElement;
  public rideId;
  public listenerId;
  constructor(
    private navCtrl: NavController,
    private util: UtilService,
    private userProvider: InitUserProvider,
    private api: APIService,
    public rideService: RideService
  ) {
    this.load();
  }

  async load() {
    this.createLoaderBar();
    this.setRideStatusListener();
    this.setLoaderBar();
    this.rideId = await this.userProvider.getRideId();

  }

  async createLoaderBar() {
    this.loader = await this.util.createLoader('Waiting for driver response...');
    await this.loader.present();
  }

  setLoaderBar() {
    this.loaderListenerId = setInterval(() => {
      this.progress += 5;
      if (this.progress > 90) { clearInterval(this.loaderListenerId); }
    }, 2000);
  }

  setRideStatusListener() {
    this.listenerId = setInterval(() => {
      this.checkRideStatus();
    }, 7000);
    this.timeoutListenerId = setTimeout(() => {
      this.clearRideStatusListener();
      this.api.setRideTimeOut(this.rideId).subscribe(res => {
        if (res.message[0]) {
          this.showTimeOutAlert();
        }
      }, err => console.log(err));
    }, 60000);
  }

  clearRideStatusListener() {
    clearInterval(this.listenerId);
    clearTimeout(this.loaderListenerId);
    clearTimeout(this.timeoutListenerId);
    this.listenerId = null;
    this.loaderListenerId = null;
    this.loaderListenerId = null;
    this.loader.dismiss();
  }

  async checkRideStatus() {
    console.log('status check.....');
    this.api.getRide(this.rideId).subscribe((ride: Ride) => {
      if (ride['ride_accepted']) {
        this.clearRideStatusListener();
        this.api.getDriver(ride.driverId).subscribe(
          driver => {
            Object.assign(this.rideService.driverInfo, driver);
          },
          err => console.log(err)
        );
        this.util.goToNew('/pickup');
      } else {
        console.log('waiting for response from driver'); // TODO
      }
    });

  }

  async showTimeOutAlert() {
    if (!this.delayAlert) {
      this.delayAlert = await this.util.createAlert(
        'Sorry!',
        true,
        environment.DRIVER_DELAY_MSG,
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
      await this.delayAlert.present();
    }
  }


  goBack() {
    this.navCtrl.back();
  }
  ionViewWillLeave() {
    this.delayAlert = null;
    this.clearRideStatusListener();
  }

}
