import { Component, OnInit   } from '@angular/core';
import { provideRouter, Route, RouterLink } from '@angular/router';

import { Router } from '@angular/router';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor(
    private _router:Router
  ){

  }
  ngOnInit(): void {
  
  }

  logOut(){
    localStorage.removeItem('token')
    this._router.navigate(['/'])

  }


}
