import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'interfazScript';
  hideMenu:boolean=false
  constructor(private router: Router) { }

  ngOnInit() {
    const token= localStorage.getItem('token')
    if(token){
      this.router.navigate(['/profile'])
    }else{
      this.router.navigate(['/'])
    }
 
  }
  isRutaEspecifica(): boolean {
    const rutaActual = this.router.url;
    return rutaActual === '/sing-in' || rutaActual === '/sing-up' || rutaActual==='/'
  }
  
}
