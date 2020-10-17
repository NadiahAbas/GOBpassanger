import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { Feedback, FeedbackService } from '@app/services/feedback.service';
import { UtilService } from '@app/services/util/util.service';
import { InitUserProvider } from '@app/services/inituser/inituser.service';

import { User } from '@app/models/user';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  public loggedInUser: User;

  feedback: Feedback = {
    name: '',
    email: '',
    message: ''
  };

  feedbackId = null;
  
  constructor(
    private route: ActivatedRoute,
    private nav: NavController, 
    private userProvider: InitUserProvider,
    private menu: MenuController,
    private feedbackService: FeedbackService, 
    private loadingController: LoadingController,
    private util: UtilService) { 
      this.loggedInUser = this.userProvider.getUserData();
      this.menu.close(); }

  ngOnInit() {
    this.feedbackId = this.route.snapshot.params['id'];
    if (this.feedbackId)  {
      this.loadFeedback();
    }
  }

  async loadFeedback() {
    const loading = await this.loadingController.create({
      message: 'Loading Feedback..'
    });
    await loading.present();

    this.feedbackService.getFeedback(this.feedbackId).subscribe(res => {
      loading.dismiss();
      this.feedback = res;
    });
  }
  
  async saveFeedback() {

    const loading = await this.loadingController.create({
      message: 'Saving Feedback..'
    });
    await loading.present();

    if (this.feedbackId) {
      this.feedbackService.updateFeedback(this.feedback, this.feedbackId).then(() => {
        loading.dismiss();
        this.util.goToNew('/home');
      });
    } else {
      this.feedbackService.addFeedback(this.feedback).then(() => {
        loading.dismiss();
        this.util.goToNew('/home');
      });
    }
  }
  }
