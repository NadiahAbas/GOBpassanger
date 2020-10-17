import { Component, OnInit } from '@angular/core';
import { RideService } from '@app/services/ride/ride.service';
import { UtilService } from '@app/services/util/util.service';
import { SetLocationComponent } from '@app/components/set-location/set-location.component';
import { environment } from '@env/environment';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  public origin: any
  public destination: any
  public pickup: boolean;
  public locatedCountry: string;
  public lat = 37.7749;
  public lng = -122.4194;
  public marker: boolean;


  constructor(
    public rideService: RideService,
    private util: UtilService
  ) { this.origin = this.rideService.origin; }

  ngOnInit() { }


  async gotoEdit(name, value, open) {
    this.rideService.locationType = name;
    if (open === 'modal') {
      const modal = await this.util.createModal(SetLocationComponent, { country: this.locatedCountry ? this.locatedCountry : environment.COUNTRY });
      await modal.present();
      await modal.onDidDismiss();
      this.origin = this.rideService.origin;
      this.destination = this.rideService.origin;
    }
    this.pickup = value;

  }

}
