
import { Component, OnInit } from '@angular/core';
import { RideService } from '@app/services/ride/ride.service';
import { UtilService } from '@app/services/util/util.service';

@Component({
  selector: 'app-changepayment',
  templateUrl: './change-payment.page.html',
  styleUrls: ['./change-payment.page.scss'],
})
export class ChangePaymentPage implements OnInit {
  public totalFare: number;
  public tripTime: number;
  public value = 'cash';
  constructor(
    public rideService: RideService,
    private util: UtilService) { }

  ngOnInit() {
    this.totalFare = this.rideService.getFare();
    this.tripTime = this.rideService.getTripTime();
  }

  submit() {
    this.util.goBack('/requestride');
  }
}
