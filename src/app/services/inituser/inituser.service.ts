import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { APIService } from '../api/api.service';
import { Storage } from '@ionic/storage';
import { User } from '@app/models/user';
import { StorageService } from '../api/firestorage.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UUID } from 'angular2-uuid';
import { UtilService } from '@app/services/util/util.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Injectable()
export class InitUserProvider {
  @ViewChild('imageProd', {static: false}) inputimageProd: ElementRef;
  public loggedInUser: User;

  urlImage: Observable<string>;
  uploadPercent: Observable<number>;

  constructor(
    private storage: Storage,
    private api: APIService,
    private camera: Camera,
    private storageServ: StorageService,
    private loadingCtrl: LoadingController,
    public util: UtilService,
    private toastCtrl: ToastController,
    private afs: AngularFireStorage,
    private aut: AngularFireAuth
  ) {
    this.createNewEmptyUser();
  }

  getUserData(): User {
    return this.loggedInUser;
  }

  
  createNewEmptyUser() {
    this.loggedInUser = {
      id: null,
      name: '',
      email: '',
      phone: '',
      iccard: '',
      password: '',
      bday: '',
      nationality: '',
      location_lat: 0,
      location_lng: 0,
      token: '',
      rideId: 0,
      location: '',
      img: ''
    };
  }

  load() {
    return new Promise((resolve, reject) => {
      this.getToken().then(token => {
        this.api.updateToken(token);
        this.api.getUser().subscribe((user: any) => {
          if (user) {
            this.setLoggedInUser(user);
          }
          resolve(true);
        }, err => {
          resolve(true);
          console.log(err);
        });
      });
    });
  }

  async setRideId(rideId) {
    this.loggedInUser.rideId = rideId;
    await this.storage.set('rideId', rideId);
  }

  async clearRideId() {  // TODO
    this.loggedInUser.rideId = null;
    await this.storage.remove('rideId');
  }

  async getRideId() {
    const rideId = await this.storage.get('rideId');
    return rideId;
  }

  async setToken(token) {
    this.api.updateToken(token);
    await this.storage.set('token', token);
  }

  async getToken() {
    const token = await this.storage.get('token');
    return token;
  }

  async setLoggedInUser(user) {
    Object.assign(this.loggedInUser, user);
    this.loggedInUser.token = await this.getToken();
    this.loggedInUser.rideId = await this.getRideId();
    await this.storage.set('id', user.id);
    console.log('SetLoggedinUser', this.loggedInUser);
  }

  async logout(): Promise<any> {
    this.createNewEmptyUser();
    await this.api.logout();
    return this.storage.clear();
  }

  getLocalUrl(_imagePath): Promise<{ url: string; nativeUrl: string; }> {
    return new Promise((resolve, reject) => {
      const name = _imagePath.split('/');
      this.makeFileIntoBlob(_imagePath, name[name.length - 1]).then((image) => {
        resolve({ url: window.URL.createObjectURL(image), nativeUrl: _imagePath });
      }).catch(error => {
        reject(error);

      });
    });
  }

  makeFileIntoBlob(_imagePath, fileName) {
    return new Promise((resolve, reject) => {
      window['resolveLocalFileSystemURL'](_imagePath, (fileEntry) => {
        fileEntry['file']((resFile) => {
          const reader = new FileReader();
          reader.onload = (evt: any) => {
            const imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = fileName;
            resolve(imgBlob);
          };
          reader.onloadend = (evt: any) => {
            const imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = fileName;
            resolve(imgBlob);
          };

          reader.onerror = (e) => {

            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        }, (err) => {

          reject(err);
        });
      }, (err) => {
      });
    });
  }

  async createLoader(message): Promise<HTMLIonLoadingElement> {
    const loader = await this.loadingCtrl.create({
      message
      // duration: 3000
    });
    return loader;
  }

  async createToast(message, showCloseButton = false, position = 'bottom' as 'top' | 'bottom' | 'middle', duration = 2000): Promise<HTMLIonToastElement> {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
      buttons: [{
        text: 'Done',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    return toast;
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((url) => {
      const name = UUID.UUID();
      // let name = url.split('/');
      // TODO
      this.makeFileIntoBlob(url, name).then(imageData => {
        this.createLoader('waiting...');
        this.storageServ.uploadContent(imageData, name).then(async success => {
          await this.loadingCtrl.dismiss();
          this.createToast('image uploded', true, 'bottom', 2100);
          console.log('success', success);
          // eslint-disable-next-line @typescript-eslint/camelcase
          this.loggedInUser.img = success.url;
        }).catch(async err => {
          await this.loadingCtrl.dismiss();
          this.createToast(`${err}`, true, 'bottom', 2100);
          console.log('err', err);
        });
      });
    }).catch(err => { console.log('err', err); });
  }

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
    const loading = await this.loadingCtrl.create({
      message: 'Loading image',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }


}
