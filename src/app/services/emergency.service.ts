import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
 
 
@Injectable({
  providedIn: 'root'
})
export class EmergencyService {

  info: any[] = [];
 
  private emergencysCollection: AngularFirestoreCollection<any>;
 
  constructor(private afs: AngularFirestore, public rout: Router) {
  }
 
  goto(id) {
    this.rout.navigateByUrl(id);
  }


  getEmergency(id) {
    this.emergencysCollection = this.afs.collection<any>(`emergencys/${id}/emergencys/`);

    return this.emergencysCollection.snapshotChanges().pipe(map((info: any[]) => {
      this.info = [];

      for (const infos of info) {
        this.info.unshift(infos);
      }
      return this.info;
    }));
  }

  updateEmergency(value, id?) {
    return this.afs.collection('emergencys').doc(value.uid).collection('emergencys').doc(id).set(value);
  }

  addEmergency(value) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`emergencys/${value.uid}/emergencys`).add({
        uid: value.uid,
        name: value.name,
        relation: value.relation,
        pno: value.pno
      });
      this.rout.navigateByUrl(`emergency`);
    });
  }
}
