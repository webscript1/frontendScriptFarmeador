import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuperTrendService } from '../../services/superTrend/super-trend.service';
import { rsiDb } from '../../interfaces/interfaces-gestion';
import { Global } from '../../services/Global';

@Component({
  selector: 'app-rsi-detail',
  templateUrl: './rsi-detail.component.html',
  styleUrl: './rsi-detail.component.scss'
})
export class RsiDetailComponent implements OnInit, OnDestroy {
  private list_subscription:Array<Subscription>=[]
  public list_rsi:Array<rsiDb>=[]
  public loading:boolean=false
  public rsiDelete:rsiDb={
    symbol: '',
    rsi: 0,
    precioClose: 0,
    bbUpper: 0,
    bbLow: 0,
    comercio: '',
    tipo: '',
    time: '',
    precioFueraBB: 0,
    date: '',
    volumen: 0,
    rsiBtc: 0,
    status: '',
    idPosition: '',
    idInstancia: ''
  }
  public idDelete:string=''
  public idInstancia:any=Global.getIdInstancia() || ''
  constructor(
    private _supertrend_service:SuperTrendService
  ){
    
  }
  ngOnDestroy(): void {
    this.list_subscription.forEach((item)=>{
      item.unsubscribe()
    })
    
  }
  ngOnInit(): void {
    this.get_rsi()
   
  }

  get_rsi(){
   let sub=    this._supertrend_service.getRsi(this.idInstancia).subscribe(
      response=>{
        console.log(response)
        this.list_rsi=response.data.reverse()
        this.list_rsi.forEach((item)=>{
          item.createdAt=this.convertirFechaUTCALocal(item.createdAt)})
        
      },
      error=>{
        console.log(error)
        
      }
    )
    this.list_subscription.push(sub)

  }
  deleteRsi(id:any){
    this.idDelete=id
    this.loading=true
    this._supertrend_service.deleteRsi(id).subscribe(
      response=>{
        console.log(response)
        if(response.data){
          let index=this.list_rsi.findIndex((item)=>item._id===response.data._id)
          if(index>-1){
            this.list_rsi.splice(index,1)
          }
          
        }
        this.loading=false
        this.idDelete=''
      },err=>{
        console.log(err)
        this.loading=false
        this.idDelete=''
      }
    )
  }

  confirDeleteRsi(rsi:rsiDb){
    this.rsiDelete=rsi
  }
  convertirFechaUTCALocal(fechaUTC: string): string {
    const fechaUTCObjeto = new Date(fechaUTC);
    const fechaLocalString = fechaUTCObjeto.toLocaleString();
  
    return fechaLocalString;
  }

}
