
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BaseDatabaseModel } from '@app/models/base-dto.model';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class FirestoreService {
  userid: any;

  constructor(
    public store: AngularFirestore,
  ) {
   
    this.userid = 1;

  }

  public createWithId<T extends BaseDatabaseModel>(collection: string, data: T): Promise<void> {
    return this.store.doc<T>(`${collection}/${data.id}`).set(this.addCreatedAt(data));
  }
  public async create<T extends BaseDatabaseModel>(collection: string, data: T): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> {
    const doc = await this.store.collection<T>(collection).add(this.addCreatedAt(data));
    return doc.get();
  }

  public get<T extends BaseDatabaseModel>(collection: string): Observable<T[]> {
    return this.store.collection<T>(collection, ref => ref.where('uid', '==', `${this.userid}`)).valueChanges({ idField: 'id' }).pipe(take(1));
  }

  public getOne<T extends BaseDatabaseModel>(collection: string, id: string): Observable<T> {
    return this.store.doc<T>(`${collection}/${id}`).valueChanges().pipe(take(1));
  }

  public update<T extends BaseDatabaseModel>(collection: string, id: string, document: Partial<T>): Promise<void> {
    return this.store.doc<T>(`${collection}/${id}`).update(this.addUpdatedAt(document));
  }

  public runQuery<T extends BaseDatabaseModel>(collection: string, query: FirestoreQuery): Observable<T[]> {
    return this.store.collection<T>(collection, ref => ref.where(query.field, query.operation, query.searchKey)).valueChanges({ idField: 'id' }).pipe(take(1));
  }

  public delete<T extends BaseDatabaseModel>(collection: string, id: string): Promise<any> {
    return this.store.doc<T>(`${collection}/${id}`).delete();
  }

  public uploadFile(folderName: string, downloadUrl: string, fileName: string): Promise<any> {
    return this.store.collection<{ downloadUrl: string; fileName: string; uid: string; }>(`fileReferences`).add({ downloadUrl, fileName, uid: this.userid });
  }
  public getImages(): Observable<any> {
    return this.store.collection('fileReferences', ref => ref.where('uid', '==', `${this.userid}`)).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        data['id'] = a.payload.doc.id;
        return data;
      });
    }));
  }
  addCreatedAt(data) {
    return { ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
  }
  addUpdatedAt(data) {
    return { ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
  }
}


export interface FirestoreQuery {
  field: string;
  operation: firebase.firestore.WhereFilterOp;
  searchKey: string;
}
