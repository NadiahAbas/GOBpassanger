
import { Component, OnInit } from '@angular/core';
import { IonDatetime, LoadingController, MenuController } from '@ionic/angular';
import { APIService } from '@app/services/api/api.service';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { environment } from '@env/environment';
import { UtilService } from '@app/services/util/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  public dialCodes = environment.COUNTRY_DIAL_CODES;
  spinner = false;
  disabled = false;
  public user = { name: '', email: '', area: '', phone: '', password: '', iccard: '', bday: '', nationality: ''  };
  bday; minDate; finishMaxDate;

  public customAlertOptions: any = {
    header: 'Contact Number',
    subHeader: 'Select Area Code',
    translucent: true
  };

  constructor(
    private userProvider: InitUserProvider,
    private menuCtrl: MenuController,
    private api: APIService,
    private loadingController: LoadingController,
    private util: UtilService,
  ) {
    this.minDate = moment().format('YYYY-MM-DDTHH:mm');
    this.finishMaxDate = moment().subtract(13, 'years').format('YYYY-MM-DDTHH:mm');

    
  }

  setDate() {

    this.minDate = this.bday;
  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  setSpinner() {
    this.spinner = true;
    this.disabled = true;
  }

  clearSpinner() {
    this.spinner = false;
    this.disabled = false;
  }

  async registerUser() {
    
    this.setSpinner();

    this.api.signUp(this.user)
      .subscribe(
        res => {
          console.log(res);
          this.userProvider.setToken(res['id']);
          this.api.getUser().subscribe((user: any) => {
            this.userProvider.setLoggedInUser(user);
            this.clearSpinner();
            this.util.goToNew('/home');
          }); 

          
        },
        async err => {
          const toast = await this.util.createToast(err.message || err.statusText, false, 'top');
          await toast.present();
          this.clearSpinner();
        }
      );
  }

  getText(e){
    var elementValue = e.srcElement.value;
    if(elementValue){
      var regex = /^[A-z]+$/;   
       var tempValue = elementValue.substring(0, elementValue.length - 1);
       if (!regex.test(elementValue)) {
         console.log("Entered char is not alphabet");
         e.srcElement.value = tempValue;
       }
    } 
  }

  getNumber(e){
    var elementValue = e.srcElement.value;
    if(elementValue){
      var regex = /^[0-9]+$/;   
       var tempValue = elementValue.substring(0, elementValue.length - 1);
       if (!regex.test(elementValue)) {
         console.log("Entered char is not numeric");
         e.srcElement.value = tempValue;
       }
    }
  }

  getIc(e){
    var elementValue = e.srcElement.value;
    if(elementValue){
      var regex = /^[0-9._-]+$/;   
       var tempValue = elementValue.substring(0, elementValue.length - 1);
       if (!regex.test(elementValue)) {
         console.log("Entered char is not numeric");
         e.srcElement.value = tempValue;
       }
    }
  } 

  

  
  
}
