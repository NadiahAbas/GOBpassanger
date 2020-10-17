import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from '@app/services/util/util.service';

@Component({
  selector: 'app-payment-component',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input('taxiType') taxiType;
  @Input('carImage') carImage;

  constructor(
    private modalCtrl: ModalController,
    private util: UtilService
  ) {
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  async routeModal() {
    this.modalCtrl.dismiss();
    this.util.goForward('/requestride');
  }

  ngOnInit() {
  }
}
