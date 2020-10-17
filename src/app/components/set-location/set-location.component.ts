
import { Component, OnInit, NgZone, Input } from '@angular/core';
import { RideService } from '@app/services/ride/ride.service';
import { ModalController } from '@ionic/angular';
import { UtilService } from '@app/services/util/util.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-setlocation',
  templateUrl: './set-location.component.html',
  styleUrls: ['./set-location.component.scss']
})
export class SetLocationComponent implements OnInit {
  searchItem = '';
  autocompleteItems = [];
  item: any;
  @Input() country: string;
  constructor(
    private __zone: NgZone,
    private rideService: RideService,
    private modalCtrl: ModalController,
    private util: UtilService
  ) {
  }

  ngOnInit() {
  }

  async searchOnChange() {
    if (this.searchItem) {
      const predictions = await this.util.getGooglePlaceAutoCompleteList(this.searchItem, {}, environment.COUNTRY);
      this.autocompleteItems = [];
      console.log(predictions);
      this.__zone.run(() => {
        if (predictions !== null) {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction.description);
          });
        }
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  reset() {
    this.searchItem = '';
  }

  chooseItem(address) {
    this.rideService.getLatLan(address).subscribe(
      result => {
        if (result) {
          this.__zone.run(() => {
            if (this.rideService.locationType === 'destination') {
              this.rideService.destination = { lat: result.lat(), lng: result.lng() };
              this.rideService.destinationAddress = address;
            }
            if (this.rideService.locationType === 'pickup') {
              this.rideService.originAddress = address;
              this.rideService.origin = { lat: result.lat(), lng: result.lng() };
            }
            this.modalCtrl.dismiss();
          });
        }
      }, error => console.log(error),
      () => console.log(`${this.rideService.locationType} selected`)
    );
  }
}

