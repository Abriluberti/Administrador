import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splah',
  templateUrl: './splah.page.html',
  styleUrls: ['./splah.page.scss'],
})
export class SplahPage implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() 
  {
    setTimeout(() => {
      this.router.navigate(['/login']); // Reemplaza 'otra-pagina' con la ruta de la página a la que deseas navegar.
    }, 3000);
  }

}
