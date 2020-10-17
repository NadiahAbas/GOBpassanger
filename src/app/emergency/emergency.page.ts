import { HttpDownloadProgressEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user';
import { EmergencyService } from '@app/services/emergency.service';
import { InitUserProvider } from '@app/services/inituser/inituser.service';
import { UtilService } from '@app/services/util/util.service';
import { SMS } from '@ionic-native/sms/ngx';
import { LoadingController, NavController, NavParams, Platform } from '@ionic/angular';
import { Howl } from 'howler';

export interface Track {
  name: string;
  path: string;
}

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss'],
})
export class EmergencyPage implements OnInit {
  
  playlist: Track[] = [
    {
      name: 'Emergency',
      path: './assets/audio/em.mp3'
    }
  ];



  activeTrack: Track = null;
  player: Howl = null;
  isPlaying = false;


  public loggedInUser: User;

  id: any;
  uid: string;
 

  name: string;
  relation: string;
  pno:string;

  cp: Boolean;
 

  constructor(
    private rout: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController, 
    private emergencyService: EmergencyService, 
    private loadingController: LoadingController,
    private util: UtilService,
    public platform: Platform,
    private userProvider: InitUserProvider, 
    private aut: AngularFireAuth,
    private sms: SMS
    
  ) { 
    
  }

  ngOnInit() {
    this.logged();
  }

  logged() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            this.uid = user.uid;
            console.log(this.uid);
            this.getEmergency(this.uid);
          }
        });
  }

  async getEmergency(id) {
    await this.emergencyService.getEmergency(id).subscribe((data: any) => {
      console.log(data);
      if (data.length !== 0) {
        this.cp = true;
        this.id = data[0].payload.doc.id;
        this.name = data[0].payload.doc.data().name;
        this.relation = data[0].payload.doc.data().relation;
        this.pno = data[0].payload.doc.data().pno;
        

        console.log('details full');
      } else {
        this.cp = false;
        console.log('empty');
      }

    });
  }
  


  saveEmergency(name, relation, pno) {
    console.log(this.cp);
    const data = {
      name: name,
      relation: relation,
      pno: pno,
      uid: this.uid

    };
    console.log(data);
    if (this.cp === false) {
      this.emergencyService.addEmergency(data).then(
        res => {
          console.log('Upload' + res);
          this.rout.navigateByUrl(`/emergency`);
        });
    } else {
      this.emergencyService.updateEmergency(data, this.id).then(
        res => {
          console.log('Upload' + res);
          this.rout.navigateByUrl(`/emergency`);
        });
    }
  }
 
  start(track: Track) { 
    if (this.player) {
      this.player.stop();
    }
   this.player = new Howl({
     src: [track.path],
     html5: true,
     onplay: () => {
       console.log('Playing..');
      this.isPlaying = true;
      this.activeTrack = track;
     },
     oneend: () => {
      console.log('stop');
      this.isPlaying = false;
      this.activeTrack = track;
     }
   });
   this.player.play();
   this.sms.send(this.pno, 'Emergency Allert! this is the current location!');

  }

  stop(track: Track) { 
    if (this.player) {
      this.player.stop();
    }
  }



   
}
