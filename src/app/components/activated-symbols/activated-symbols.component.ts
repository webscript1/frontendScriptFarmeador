import { Component, Input } from '@angular/core';
import { activatedSymbol, gestionAtr } from '../../interfaces/interfaces-gestion';

import { SuperTrendService } from '../../services/superTrend/super-trend.service';

@Component({
  selector: 'app-activated-symbols',
  templateUrl: './activated-symbols.component.html',
  styleUrls: ['./activated-symbols.component.scss']
})
export class ActivatedSymbolsComponent {
  @Input()
  instancias: Array<gestionAtr> = [];

  public activatedSymbol:Array<activatedSymbol>
  public idInstanciaAEliminar:any
  public loadingDeleteInstancia:boolean
  public dstosInstanciaAeliminar:gestionAtr | undefined 

  constructor(
    private _botServoce:SuperTrendService
  ){
   this.activatedSymbol=[]
   this.loadingDeleteInstancia=false
   this.idInstanciaAEliminar=''
   
  }

   convertirFechaUTCALocal(fechaUTC: string): string {
    const fechaUTCObjeto = new Date(fechaUTC);
    const fechaLocalString = fechaUTCObjeto.toLocaleString();
  
    return fechaLocalString;
  }

  deteleInstancia(){
   if(this.dstosInstanciaAeliminar){
    const id=this.dstosInstanciaAeliminar.id
    this.loadingDeleteInstancia=true
    this.idInstanciaAEliminar=this.dstosInstanciaAeliminar.id
    this._botServoce.deleteInstancia(id).subscribe(
      response=>{
        console.log(response)
        if(response.code===200){
          const index=this.instancias.findIndex((instancia)=> instancia.id===id )

          this.instancias.splice(index,1)
        }
        this.loadingDeleteInstancia=false
        this.idInstanciaAEliminar=''
      },
      error=>{
        console.log(error)
        this.loadingDeleteInstancia=false
        this.idInstanciaAEliminar=''
      }
    )
   }
  }

  conFirmarDeleteInstancia(data:gestionAtr){
    this.dstosInstanciaAeliminar=data
  }

}
