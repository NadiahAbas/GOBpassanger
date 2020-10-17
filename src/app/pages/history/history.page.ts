import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from '@app/services/api/api.service';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { UtilService } from '@app/services/util/util.service';
import { User } from '@app/models/user';
import { Ride } from '@app/models/ride';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { RideDetailsPage } from '@app/pages/ride-details/ride-details.page';
import { RideService } from '@app/services/ride/ride.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html', 
  styleUrls: ['./history.page.scss']
})
export class HistoryPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  
  public rides: Ride[];
  public loader: HTMLIonLoadingElement;
  public location: UtilService;

  constructor(
    private api: APIService,
    private userProvider: InitUserProvider,
    private util: UtilService,
    public rideService: RideService,
    public modalController: ModalController
  ) {
  }

  ngOnInit() {
    const loggedInUser: User = this.userProvider.getUserData();
    this.getHistory(loggedInUser.id);
  }

  async showLoader() {
    this.loader = await this.util.createLoader('Loading history ...');
    await this.loader.present();
  }

  async dismissLoader() {
    await this.loader.dismiss();
  }

  async getHistory(userId) {
    await this.showLoader();
    this.api.getRideHistory(userId)
      .subscribe((rides: Ride[]) => {
        if (rides) {
          this.rides = this.util.latLngConverterSQL(rides);
          this.dismissLoader();
        }
      });
  }

  dismiss() {
    this.util.goToNew('/home');
  }
 
  loadData(event) {
    setTimeout(() => {
      event.target.complete();
      event.target.disabled = true;
    }, 2000);
  }
  async showInfo(ride) {
    const detailModal: any = await this.util.createModal(RideDetailsPage, { rideInfo: ride });
    await detailModal.present();
  }
}
