
import { Component, OnInit } from '@angular/core';
import { RideService } from '@app/services/ride/ride.service';

@Component({
  selector: 'app-fareestimate',
  templateUrl: './fare-estimate.page.html',
  styleUrls: ['./fare-estimate.page.scss'],
})
export class FareEstimatePage implements OnInit {
  public totalFare: number;
  public tripTime: number;

  constructor(public rideService: RideService) { }

  ngOnInit() {
    this.totalFare = this.rideService.getFare();
    this.tripTime = this.rideService.getTripTime();
  }

}
