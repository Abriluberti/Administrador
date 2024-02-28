import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { MensajesService } from 'src/app/services/mensaje.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private mensajesService: MensajesService
  ) {}

  async login() {
    try {
      // Validar si el correo electrónico y la contraseña están vacíos
      if (!this.email || !this.password) {
        this.mensajesService.mostrar('Error', 'Debes completar todos los campos con correo valido.', 'error');
        return;
      }

      const result = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      if (result.user) {
        // Inicio de sesión exitoso, redirigir al usuario a la página principal
        this.navCtrl.navigateRoot('/listado');
      } else {
        console.error('Inicio de sesión fallido');
        this.mensajesService.mostrar('Error', 'Inicio de sesión fallido.', 'error');
      }
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error.message);
      // Mostrar el mensaje de error al usuario
      this.mensajesService.mostrar('Error', 'Error al iniciar sesión. Verifica tus credenciales.', 'error');
    }
  }

  OnFillFields(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
