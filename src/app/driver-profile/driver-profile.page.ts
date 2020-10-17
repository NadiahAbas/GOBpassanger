import { Component, Input, OnInit } from '@angular/core';
import { Driver } from '@app/models/driver';
import { APIService } from '@app/services/api/api.service';
import { RideService } from '@app/services/ride/ride.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.page.html',
  styleUrls: ['./driver-profile.page.scss'],
})
export class DriverProfilePage implements OnInit {
  @Input() driverInfo: any;
  public item: Driver;
  public driver: string;
  public originAddr: any;
  drivers: RideService[];

  constructor(
    public modalController: ModalController,
    private api: APIService,
    private RideService: RideService
  ) { }

  ngOnInit() {
    this.api.getDriver(this.RideService.driverInfo).subscribe(res => {
      this.driver = res;
    });
  }

}
