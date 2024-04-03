import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { detallesGestion, gestionAtr } from 'src/app/interfaces/interfaces-gestion';
import { SuperTrendService } from 'src/app/services/superTrend/super-trend.service';

@Component({
  selector: 'app-open-position',
  templateUrl: './open-position.component.html',
  styleUrls: ['./open-position.component.scss']
})
export class OpenPositionComponent implements OnInit, OnDestroy{
  @Input() list_position_open: Array<detallesGestion>;
  public dstosInstanciaAeliminar:detallesGestion | undefined
  private list_subscroption:Array<Subscription>=[] 

  constructor (
    private _superTrenService:SuperTrendService
    
  ){
    this.list_position_open=[]

  }
  ngOnDestroy(): void {
        this.list_subscroption.forEach((item)=>{
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
    this._superTrenService.delete_position_list_local(id).subscribe(
      response=>{
          console.log(response)
          if(response.code===200){
           const index= this.list_position_open.findIndex((item)=> item.id===id)
           if(index!==-1){
             this.list_position_open.splice(index,1)
           }
          }
      },
      error=>{
        console.log(error)
      }
    )
     
  }



}
