
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { APIService } from '@app/services/api/api.service';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { User } from '@app/models/user';
import { UtilService } from '@app/services/util/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public user: any = { email: '', password: '' };
  public spinner = false;
  public disabled = false;
  constructor(
    private userProvider: InitUserProvider,
    private menuCtrl: MenuController,
    private api: APIService,
    private util: UtilService,
  ) { }

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

  login() {
    this.setSpinner();
    this.api.logIn(this.user.email, this.user.password)
      .subscribe(
        res => {
          this.userProvider.setToken(res['id']);
          this.api.getUser().subscribe((responseUser: any) => {
            this.userProvider.setLoggedInUser(responseUser);
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
}
