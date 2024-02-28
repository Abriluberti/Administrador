import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { AlertController, NavController } from '@ionic/angular';
import { MensajesService } from 'src/app/services/mensaje.service';


import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
const { Permissions } = Plugins;
import { Plugins } from '@capacitor/core';

// Importa otros servicios y clases según sea necesario

import { Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage {
  user: any = {};
  confirmPassword: string = '';
  usandoQR: boolean = false;
  


  constructor(
    private alertController: AlertController,
    private afAuth: AngularFireAuth,
        private mensajesService: MensajesService,
    private firestore: Firestore,
    private router: Router,
    private navCtrl: NavController,
   
  ) {}

  async registerUser() {
    // Validar que no haya campos en blanco
    if (
      !this.user.photo ||
      !this.user.apellidos ||
      !this.user.nombres ||
      !this.user.dni ||
      !this.user.correo ||
      !this.user.clave ||
      !this.confirmPassword
    ) {
      this.mensajesService.mostrar(
        'ERROR',
        'Por favor, completa todos los campos.',
        'error'
      );
      return;
    }
  
    // Validar que las contraseñas coincidan
    if (this.user.clave !== this.confirmPassword) {
      this.mensajesService.mostrar(
        'ERROR',
        'Las contraseñas no coinciden. ' +
          `Clave: ${this.user.clave}, Confirmación: ${this.confirmPassword}`,
        'error'
      );
  
      return;
    }
    if (this.user.clave.length < 6 || this.user.clave.length > 16) {
      this.mensajesService.mostrar(
        'ERROR',
        'La contraseña debe tener entre 6 y 16 caracteres.',
        'error'
      );
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(this.user.nombres)) {
      this.mensajesService.mostrar(
        'ERROR',
        'El campo de nombres debe contener solo letras.',
        'error'
      );
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(this.user.apellidos)) {
      this.mensajesService.mostrar(
        'ERROR',
        'El campo de apellido debe contener solo letras.',
        'error'
      );
      return;
    }
    if (!this.validarFormatoCorreo(this.user.correo)) {
      return;
    }
    // Validar que el DNI sea numérico y tenga exactamente 8 dígitos
    if (!/^\d{8}$/.test(this.user.dni)) {
      this.mensajesService.mostrar(
        'ERROR',
        'El DNI debe contener solo números y tener 8 dígitos.',
        'error'
      );
      return;
    }
  
    // Validar que el correo no esté repetido
    const correoRepetido = await this.correoRepetido(this.user.correo);
    if (correoRepetido) {
      this.mensajesService.mostrar(
        'ERROR',
        'Ese correo ya está siendo usado ',
        'error'
      );
      return;
    }
  
    // Continuar solo si todas las validaciones pasan
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        this.user.correo,
        this.user.clave
      );
  
      if (userCredential && userCredential.user) {
        const userId = userCredential.user.uid;
  
        // Verifica si la URL de la imagen y los datos del usuario están disponibles
        if (this.user.photo && userId) {
          const imageBlob = this.dataURItoBlob(this.user.photo);
  
          const fotoData = {
            url: this.user.photo,
            userId: userId,
            userName: this.user.correo, // Usa el correo como nombre de usuario por defecto
            dni: this.user.dni, // Agrega DNI al documento de la foto
            nombres: this.user.nombres, // Agrega nombres al documento de la foto
            apellidos: this.user.apellidos,
            timestamp: new Date(),
            votosLindos: [],
            votosFeos: [],
            likesCount: 0,
          };
  
          const referencia = collection(this.firestore, 'cosaslindas');
          await addDoc(referencia, fotoData);
  
          // Después de agregar el usuario con éxito, reinicia los campos del usuario
          this.user = {};
          this.confirmPassword = '';
        } else {
          console.error('La imagen seleccionada no tiene una URL válida o falta el usuario.');
        }
  
        this.mensajesService.mostrar(
          'Perfecto!',
          'Enviado correctamente',
          'success'
        );
      }
    } catch (error: any) {
      console.error('Error durante el registro:', error);
      this.mensajesService.mostrar(
        'Error!',
        'Ese correo ya está siendo usado',
        'error'
      );
    }
  }
  

 
  validarFormatoCorreo(correo: string): boolean {
    // Expresión regular para validar el formato del correo electrónico
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verifica si el correo cumple con el formato
    if (!formatoCorreo.test(correo)) {
      this.mensajesService.mostrar(
        'ERROR',
        'Por favor, ingresa un correo electrónico válido.',
        'error'
      );
      return false;
    }

    // El correo tiene el formato adecuado
    return true;
  }

 
  async solicitarPermisosDeCamara() {
    const { Permissions } = Plugins;
  
    try {
      const permisos = await Permissions['requestPermissions']({ permissions: ['camera'] });

      
      if (permisos.camera && permisos.camera.state === 'granted') {
        // Ahora tienes permisos de cámara, puedes usar el escáner de códigos QR.
        this.escanearDNI();
      } else {
        console.error('No se concedieron los permisos de cámara.');
        // Puedes mostrar un mensaje al usuario informándole que necesita dar permisos de cámara.
      }
    } catch (error) {
      console.error('Error al solicitar permisos de cámara:', error);
    }
  }
  
  async escanearDNI() {
    await BarcodeScanner.checkPermission({ force: true });

    this.usandoQR = true;
    await BarcodeScanner.hideBackground();
    document.querySelector('body')?.classList.add('scanner-active');

    const datos = await BarcodeScanner.startScan();

    if (datos?.hasContent) {
      await BarcodeScanner.showBackground();
      document.querySelector('body')?.classList.remove('scanner-active');
      this.usandoQR = false;
      let datosSeparados = datos.content.split('@');
      this.user.apellidos = datosSeparados[1];
      this.user.nombres = datosSeparados[2];
      this.user.dni = datosSeparados[4];
    }
  }
  
  procesarContenidoQR(contenidoQR: string) {
    // Divide el contenido del código QR en líneas
    const lineas = contenidoQR.split('\n');
  
    // Objeto para almacenar los datos del DNI
    const datosDNI = {
      nombres: '',
      apellidos: '',
      dni: ''
    };
  
    // Recorre las líneas y extrae los datos
    for (const linea of lineas) {
      if (linea.startsWith('Nombres:')) {
        datosDNI.nombres = linea.replace('Nombres:', '').trim();
      } else if (linea.startsWith('Apellidos:')) {
        datosDNI.apellidos = linea.replace('Apellidos:', '').trim();
      } else if (linea.startsWith('DNI:')) {
        datosDNI.dni = linea.replace('DNI:', '').trim();
      }
    }
  
    return datosDNI;
  }
  



  async tomarFoto() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 20,
    });

    if (image && image.dataUrl) {
      this.user.photo = image.dataUrl;
    }
  }

  async presentSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async seleccionarFoto() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos, // Utiliza CameraSource.Photos para seleccionar una foto de la galería
    });

    if (image && image.dataUrl) {
      this.user.photo = image.dataUrl;
    }
  }

  goToRegistrationPage() {
    this.navCtrl.navigateRoot('/listado');
  }

  signOut() {
    this.navCtrl.navigateRoot('/login');
  }

  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  async correoRepetido(correo: string): Promise<boolean> {
    try {
      const referencia = collection(this.firestore, 'cosaslindas');
      const consulta = query(referencia, where('correo', '==', correo));
      const querySnapshot = await getDocs(consulta);

      // Si la consulta no está vacía, significa que hay al menos un documento con ese correo
      const correoRepetido = !querySnapshot.empty;

      if (correoRepetido) {
        this.mensajesService.mostrar(
          'ERROR',
          'Ese correo ya está siendo usado.',
          'error'
        );
      }

      return correoRepetido;
    } catch (error) {
      console.error('Error al verificar el correo repetido:', error);
      this.mensajesService.mostrar(
        'ERROR',
        'Hubo un problema al verificar el correo repetido.',
        'error'
      );
      return false; // Devuelve false en caso de error
    }
  }

  
 }