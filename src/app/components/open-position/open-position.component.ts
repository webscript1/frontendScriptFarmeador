import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { detallesGestion, gestionAtr } from 'src/app/interfaces/interfaces-gestion';
import { SuperTrendService } from 'src/app/services/superTrend/super-trend.service';
import * as moment from 'moment';

@Component({
  selector: 'app-open-position',
  templateUrl: './open-position.component.html',
  styleUrls: ['./open-position.component.scss']
})
export class OpenPositionComponent implements OnInit, OnDestroy{
  @Input() list_position_open: Array<{gestion:detallesGestion,candles:Array<any>}>;
  public dstosInstanciaAeliminar:detallesGestion | undefined
  private list_subscription:Array<Subscription>=[] 

  constructor (
    private _superTrenService:SuperTrendService
    
  ){
    this.list_position_open=[]

  }
  ngOnDestroy(): void {
        this.list_subscription.forEach((item)=>{
           item.unsubscribe()
        })
  }
  ngOnInit(): void {
   
  }
  conFirmarDeleteInstancia(data:detallesGestion){
    console.log('cofirmar delete')
    console.log(data)
    this.dstosInstanciaAeliminar=data
  }

  delete_position_of_list_local(){
    const id=this.dstosInstanciaAeliminar?.id || ''
   let subcription1= this._superTrenService.delete_position_list_local(id).subscribe(
      response=>{
          console.log(response)
          if(response.code===200){
           const index= this.list_position_open.findIndex((item)=> item.gestion.id===id)
           if(index!==-1){
             this.list_position_open.splice(index,1)
           }
          }
      },
      error=>{
        console.log(error)
      }
    )
    this.list_subscription.push(subcription1)
     
  }
  convertirFechamilesegundosLocal(fechaUTC: string): any {
    let dateNumber=parseFloat(fechaUTC)
   
    const fechaUTCObjeto =  new Date(dateNumber) //moment.unix((dateNumber));
    
    //const formattedDate = fechaUTCObjeto.format('MM Do YYYY, h:mm:ss a'); 
   // console.log('fecha momen: ',formattedDate)
   
    return fechaUTCObjeto.toLocaleString();
  }
 



}



