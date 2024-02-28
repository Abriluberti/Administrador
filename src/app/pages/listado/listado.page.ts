import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit {
  photos: any[] = [];
  currentUser: any;

  constructor(private firestore: Firestore, private router: Router, private navCtrl: NavController, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loadPhotos();
  }

  currentUserIsAdmin(): boolean {
    return this.currentUser?.email === 'admin@admin.com';
  }

  goToRegistrationPage() {
    this.navCtrl.navigateRoot('/registration');
  }

  signOut() {
    this.navCtrl.navigateRoot('/login');
  }

  async loadPhotos() {
    const reference = collection(this.firestore, 'cosaslindas');
    const photosQuery = query(reference);

    const snapshot = await getDocs(photosQuery);
    this.photos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Ordenar las fotos alfabéticamente por el nombre de usuario
    this.photos.sort((a, b) => {
      const nameA = a.userName.toUpperCase();
      const nameB = b.userName.toUpperCase();
      return nameA.localeCompare(nameB);
    });

    console.log('Fotos cargadas y ordenadas:', this.photos);
  }
}
