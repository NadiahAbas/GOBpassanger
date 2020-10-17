
import { Component } from '@angular/core';

import { environment } from '@env/environment';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { RideService } from '@app/services/ride/ride.service';
import { UtilService } from '@app/services/util/util.service';

declare let paypal_sdk: any;


@Component({
  selector: 'app-addcard',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage {
  public totalFare: number;
  public currencyIcon: String = 'USD';
  addScript: boolean = false;



  constructor(
    private payPal: PayPal,
    public rideService: RideService,
    private util: UtilService) {
      this.totalFare = this.rideService.getFare();


      let _this = this;
    setTimeout(() => {
      // Render the PayPal button into #paypal-button-container
      <any>window['paypal'].Buttons({

        // Set up the transaction
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: _this.totalFare
              }
            }]
          });
        },

        // Finalize the transaction
        onApprove: function (data, actions) {
          return actions.order.capture()
            .then(function (details) {
              // Show a success message to the buyer
              alert('Transaction completed');
            })
            .catch(err => {
              console.log(err);
            })
        }
      }).render('#paypal-button-container');
    }, 500)
  }

  done(){
    this.util.goBack('/pickup');
  }
     }
     
