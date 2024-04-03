import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { detallesGestion, gestionAtr } from '../../interfaces/interfaces-gestion';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { Global } from 'src/app/services/Global';

@Component({
  selector: 'app-info-position',
  templateUrl: './info-position.component.html',
  styleUrls: ['./info-position.component.scss']
})
export class InfoPositionComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() list_orders_gestionAtr: Array<detallesGestion>;
  

  constructor(
  ){
   this.list_orders_gestionAtr=[]
  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {
 
  }
  ngOnInit(): void {
    
  }



}
