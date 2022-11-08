import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { Router } from '@angular/router';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.fireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!)
      }
    });
  };


  login(email: string, password: string) {
    return this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        this.setUserData(response.user);
        this.fireAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      }).catch((err) => {
        window.alert(err.message);
      });
  };

  register(email: string, password: string) {
    return this.fireAuth
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {

      this.setUserData(response.user);
      this.sendVerificationEmail();
    })
    .catch((err) => {
      window.alert(err.message);
    });
  };

  sendVerificationEmail() {
    return this.fireAuth.currentUser
      .then((user) => user!.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      })
      .catch((err) => {
        window.alert(err.message);
      });
  };

  logout() {
    return this.fireAuth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['login']);
      })
      .catch((err) => {
        window.alert(err.message);
      });
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  authenticatedLogin(provider: any) {
    return this.fireAuth
      .signInWithPopup(provider)
      .then((response) => {
        this.setUserData(response.user);
        this.router.navigate(['dashboard'])
      })
      .catch((err) => {
        window.alert(err);
      });
  }

  googleAuth() {
    return this.authenticatedLogin( new auth.GoogleAuthProvider() );
  }

  forgotPassword(passwordResetEmail: string) {
    return this.fireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox');
      })
      .catch((err) => {
        window.alert(err.message);
      })
  }

  setUserData(user: any) {
    const userReference: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);

    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };

    return userReference.set(userData, { merge: true });
  }

}
