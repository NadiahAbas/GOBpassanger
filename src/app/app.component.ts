
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { environment } from '@env/environment';
import { User } from '@app/models/user';
import { UtilService } from './services/util/util.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public loggedInUser: User;
  public menuItems = environment.MAIN_MENU_ITEMS;
  constructor(
    private userProvider: InitUserProvider,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private util: UtilService
  ) {
    this.initializeApp();
    this.loggedInUser = this.userProvider.getUserData();
    if (this.loggedInUser.id) {
      this.util.goToNew('/home');
    } else {
      this.util.goToNew('/welcome');
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (environment.GOOGLE_MAPS_API_KEY && environment.GOOGLE_MAPS_API_KEY === 'AIzaSyCEVHnj_VE5v0v2FLRx5c33Xz7h34WWDr8') {
      }
    });
  }

  redirectTo(page) {
    this.util.goForward(`/${page.url}`);
  }

  async logoutAction() {
    const delayAlert = await this.util.createAlert(
      'Confirm',
      true,
      environment.LOGOUT_CONFIRMATION,
      {
        text: 'Logout',
        cssClass: '',
        handler: async () => {
          this.logout();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
    );
    await delayAlert.present();
  }
  logout() {
    this.userProvider.logout().then(res => {
      this.util.goToNew('/loginPage');
    });
  }
}

