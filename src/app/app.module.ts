import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';


import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { FirestoreModule, provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';



const firebaseConfig = {
  projectId: 'administracion-5bbd6',
  appId: '1:297470477470:web:c8588e53a9b1a1d77aa78f',
  storageBucket: 'administracion-5bbd6.appspot.com',
  apiKey: 'AIzaSyCUkYJoBzK3A_RnSFl0CC4LaIdGqpF8Na0',
  authDomain: 'administracion-5bbd6.firebaseapp.com',
  messagingSenderId: '297470477470',
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig), // Utiliza la configuración de firebaseConfig
    FirestoreModule, // Esta importación está en el lugar correcto
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Utiliza la configuración de firebaseConfig
    provideFirestore(() => getFirestore()),
  
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  exports: [FormsModule, ReactiveFormsModule]
})
export class AppModule {}
