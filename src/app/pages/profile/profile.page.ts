import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { SetLocationComponent } from '@app/components/set-location/set-location.component';
import { User } from '@app/models/user';
import { APIService } from '@app/services/api/api.service';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { UtilService } from '@app/services/util/util.service';
import { environment } from '@env/environment';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  id: any;
  uid: string;

  img: any;
  urlImage: Observable<string>;
  uploadPercent: Observable<number>;
  
  bday; minDate; finishMaxDate;
  public customAlertOptions;
  public loggedInUser: User;
  public dialCodes;

  cp: boolean;
  
  constructor(
    private util: UtilService,
    private userProvider: InitUserProvider,
    private api: APIService,
    private afs: AngularFireStorage,
    private loadingController: LoadingController,
    private aut: AngularFireAuth
  ) {
    this.dialCodes = environment.COUNTRY_DIAL_CODES;
    this.minDate = moment().format('YYYY-MM-DDTHH:mm');
    this.finishMaxDate = moment().subtract(13, 'years').format('YYYY-MM-DDTHH:mm');
  }
  
  setDate() {

    this.minDate = this.bday;
  }

  ngOnInit() {
    this.loggedInUser = this.userProvider.getUserData();
    console.log('user', this.loggedInUser); 
  }

  async gotoEdit() {
    const profileModal: any = await this.util.createModal(SetLocationComponent);
    profileModal.present();
  }


  // async openActionsheet(e) {
  //   const action = await this.util.createActionSheet({
  //     text: 'Take a Picture',
  //     role: 'destructive',
  //     cssClass: 'buttonCss',
  //     handler: () => {
  //       this.userProvider.openCamera();
  //     }
  //   }, {
  //     text: 'Pick From Gallery',
  //     handler: () => {
  //       this.openGallery(e);
  //     }
  //   }, {
  //     text: 'Cancel',
  //     role: 'cancel',
  //     cssClass: 'buttonCss_Cancel',
  //     handler: () => {
  //       console.log('cancel');
  //     }
  //   });

  //   await action.present();
  // }

  openGallery(e) {
    console.log(e.target.files[0]);

    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `image/pic_${id}`;
    const ref = this.afs.ref(filePath);
    const task = this.afs.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.presentLoading();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading image',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }


    

  async updateProfileDetails() {
  
    if (!this.loggedInUser.name) {
      const toast = await this.util.createToast('Name cannot be empty', false, 'top');
      await toast.present();
    } else if (!this.loggedInUser.email) {
      const toast = await this.util.createToast('Email cannot be empty', false, 'top');
      await toast.present();
    } else {
      this.api.updateUser(this.loggedInUser.id, this.loggedInUser).subscribe(async (updatedUser) => {
        const toast = await this.util.createToast('Profile updated', false, 'top');
        await toast.present();
      });
    }
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
