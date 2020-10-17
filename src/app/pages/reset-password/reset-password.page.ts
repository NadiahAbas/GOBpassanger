
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '@app/services/api/api.service';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  constructor(
    private menuCtrl: MenuController,
    private authService:APIService,
    private router: Router,
    private alertCtrl:AlertController
    ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  async resetPassword(form):Promise<void>{
    this.authService.resetPassword(form.value.email).
    then(
      async ()=>{
        const alert = await this.alertCtrl.create({
          message:'check your email to reset password',
          buttons:[{text:'ok',role:'cancel', handler:()=>{
            this.router.navigateByUrl('/loginPage');
          },},],
        });
        await alert.present();
        
      },
      async error => {
        const errorAlert = await this.alertCtrl.create({
          message:error.message,
          buttons:[{text:'ok',role:'cancel'}],
        });
        await errorAlert.present();
      }
    );
  }

}
