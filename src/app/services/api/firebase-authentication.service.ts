
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { UtilService } from '../util/util.service';

export class AuthInfo {
  
  constructor(
    public $uid: string) { }

  isLoggedIn() {
    return !!this.$uid;
  }
}

@Injectable()
export class AuthenticationService {
  static UNKNOWN_USER = new AuthInfo(null);
  public authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthenticationService.UNKNOWN_USER);
  router: any;

  constructor(private fireAuth: AngularFireAuth, private util: UtilService, ) {

    this.fireAuth.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        this.authInfo$.next(new AuthInfo(user.uid));
      }
    });
  }

  SendVerificationMail() {
    return this.fireAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['/home']);
    })
  }

  public createAccount(
    email: string, 
    password: string
    ): Promise<any> {
    return new Promise<any>((resolved, rejected) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          this.SendVerificationMail();
          if (res.user) {
            resolved(res.user);
          } else {
            rejected(res);
          }
        })
        .catch(err => {
          rejected(err);
        });
    });
  }
  


  public login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolved, rejected) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email, password)
        .then(res => {
          if (res.user) {
            resolved(res.user);
          }
        })
        .catch(err => {
          rejected(err);
        });
    });
  }

  public logout(): Promise<void> {
    this.authInfo$.next(AuthenticationService.UNKNOWN_USER);
    return this.fireAuth.auth.signOut();
  }
  public checkAuth() {
    return new Promise((resolve) => {
      this.fireAuth.auth.onAuthStateChanged(user => {
        resolve(user);
      });
    });
  }
 
}
