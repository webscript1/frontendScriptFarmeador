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
   this.list_orders_gestionAtr=[].reverse()
  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {
 
  }
  ngOnInit(): void {
    
  }
  convertirFechaUTCALocal(fechaUTC: string): string {
   
    const fechaUTCObjeto = new Date(fechaUTC);
    const fechaLocalString = fechaUTCObjeto.toLocaleString();
  
    return fechaLocalString;
  }
 



}
