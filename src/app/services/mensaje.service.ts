import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }

  mostrar(titulo:any,mensaje:any,icono:any){
    if(icono === 'error'){
     
    }
    return Swal.fire({
      icon: icono,
      title: titulo,
      text: mensaje,
      heightAuto: false
    })
  }

  mostrarHtml(titulo:any,mensaje:any,icono:any){
    if(icono === 'error'){
    
    }
    return Swal.fire({
      icon: icono,
      title: titulo,
      html: mensaje,
      heightAuto: false
    })
  }
}
