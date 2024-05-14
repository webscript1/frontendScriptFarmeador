import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { activatedSymbol, gestionAtr } from '../../interfaces/interfaces-gestion';

import { SuperTrendService } from '../../services/superTrend/super-trend.service';
import { Subscription } from 'rxjs';
import { Global } from 'src/app/services/Global';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activated-symbols',
  templateUrl: './activated-symbols.component.html',
  styleUrls: ['./activated-symbols.component.scss']
})
export class ActivatedSymbolsComponent implements OnInit, OnDestroy {
  @Input()
  instancias: Array<gestionAtr> = [];

  public activatedSymbol:Array<activatedSymbol>
  public idInstanciaAEliminar:any
  public loadingDeleteInstancia:boolean
  public dstosInstanciaAeliminar:gestionAtr | undefined 
  public listSubcriptions:Array<Subscription>

  constructor(
    private _botService:SuperTrendService,
    private toastr: ToastrService,
  
  ){
   this.activatedSymbol=[]
   this.loadingDeleteInstancia=false
   this.idInstanciaAEliminar=''
   this.listSubcriptions=[]

   
  }
  ngOnDestroy(): void {
   this.listSubcriptions.forEach((item)=>{
             item.unsubscribe()
   })
  }
  ngOnInit(): void {
    
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
   let subcription1= this._botService.deleteInstancia(id).subscribe(
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
        if(error.error.code===404){
          const index=this.instancias.findIndex((instancia)=> instancia.id===id )

          if(index!==-1){
            this.instancias.splice(index,1)
          }

         

        }
        if(error.status===401){
          this.toastr.warning(error.error.message);
        }  
        this.loadingDeleteInstancia=false
        this.idInstanciaAEliminar=''
      }
    )
    this.listSubcriptions.push(subcription1)
   }
   
  }

  conFirmarDeleteInstancia(data:gestionAtr){
    this.dstosInstanciaAeliminar=data
  }

  getInstanciasWs(){
   let subcription2= this._botService.get_instancias_script().subscribe(
      response=>{
        console.log('instancias ws')
        console.log(response)
      },
      error=>{
       console.error(error)
      }
    )
    this.listSubcriptions.push(subcription2)
  }

}
