import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
 
export interface Feedback {
  id?: string;
  name: string;
  email: string;
  message: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
 
  private feedbacksCollection: AngularFirestoreCollection<Feedback>;
 
  private feedbacks: Observable<Feedback[]>;

  constructor(private afs: AngularFirestore) {
    
    this.feedbacksCollection = afs.collection<Feedback>('feedbacks');
    
    this.feedbacks = this.feedbacksCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getFeedbacks() {
    return this.feedbacks;
  }

  getFeedback(id) {
    return this.feedbacksCollection.doc<Feedback>(id).valueChanges();
  }

  updateFeedback(feedback: Feedback, id: string) {
    return this.feedbacksCollection.doc(id).update(feedback);
  }

  addFeedback(feedback: Feedback) {
    return this.feedbacksCollection.add(feedback);
  }
}
