import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Account_info, detallesGestion, gestionAtr } from 'src/app/interfaces/interfaces-gestion';
import { SuperTrendService } from 'src/app/services/superTrend/super-trend.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/services/shared_data/shared_data.service';
import { WsService } from 'src/app/services/ws/ws.service';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Global } from 'src/app/services/Global';

@Component({
  selector: 'app-open-position',
  templateUrl: './open-position.component.html',
  styleUrls: ['./open-position.component.scss']
})
export class OpenPositionComponent implements OnInit, OnDestroy{
  @Input() list_position_open: Array<detallesGestion>;
  public dstosInstanciaAeliminar:detallesGestion | undefined
  private list_subscription:Array<Subscription>=[]
  public verCandle:any=undefined
  public show_detail:boolean=false 
  public editPosition:any
  public statusEditString:string=''
  public datosPositionUpdate:detallesGestion | undefined
  public info_account:Account_info={
    capital: 0,
    risk: 0,
    tprelation: 0,
    positions: [],
    mg: 0,
    loss: 0,
    win: 0,
    winPorcentaje: 0,
    drawdown: 0,
    currentcapital: 0,
    maximoCapital: 0,
    totalOperations: 0,
    profit: 0,
    profitPorcentaje: 0
  }
  public idInstancia:any=Global.getIdInstancia() || ''
 

  constructor (
    private _superTrenService:SuperTrendService,
    private toastr: ToastrService,
    private _shared_data:SharedDataService,
    private __wsService:WsService,
    private audioService: AudioService,
    
  ){
    this.list_position_open=[]

  }
  ngOnDestroy(): void {
    this.__wsService.disconected()
        this.list_subscription.forEach((item)=>{
           item.unsubscribe()
        })
  }
  ngOnInit(): void {
    let sub= this._shared_data.account_Info.subscribe(
      (response:Account_info)=>{
        this.info_account=response

      },
      error=>{
        console.error(error)
      }
    )
    this.list_subscription.push(sub)
    this.get_list_positions(this.idInstancia)
    this.conectionWs()
   
  }
  conFirmarDeleteInstancia(data:detallesGestion){
  
    this.dstosInstanciaAeliminar=data
  }

  delete_position_open(){
    const id=this.dstosInstanciaAeliminar?._id || ''
   let subcription1= this._superTrenService.delete_position(id).subscribe(
      response=>{
          console.log(response)
          if(response.code===200){
           const index= this.list_position_open.findIndex((item)=> item._id===id)
           if(index!==-1){
             this.list_position_open.splice(index,1)
           }
           this.toastr.success(response.message);
          }
       
      },
      error=>{
        console.log(error)
        if(error.status===401){
          this.toastr.warning(error.error.message);
        }  
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


  seeCandle(id:any){
   
     this.verCandle=id
  }

  hideCandles(){
      this.verCandle=undefined
  }

  showDetail(){
     if(this.show_detail){
      this.show_detail=false
     }else{
      this.show_detail=true
     }

  }

  edit_position(id:any){
    this.editPosition=id
  }
  cancel_edit(){
    this.editPosition=undefined
  }

  update_position(position:detallesGestion){
    let data={
      id:position._id,
      status:this.statusEditString,
      sl:position.sl,
      tp:position.tp
    }
    
    let subcription2= this._superTrenService.update_position(data).subscribe(
      response=>{
        console.log(response)
        if(response.code===200){
          let id=response.data._id
          this.list_position_open.forEach((data)=>{
             if(id===data._id){
              data.status=response.data.status
             }
          })
          this.statusEditString=''
          this.statusEditString=''
          this.editPosition=''
          this.winRateInfo(this.list_position_open)
          this.toastr.success(`position "${position.symbol} ${position.side}" successfully updated`,);
        }
      

      },error=>{
        console.error(error)
        
          if(error.status===401){
            this.toastr.warning(error.error.message);
          }  
        
      }
    )
    this.list_subscription.push(subcription2)
  }
  
  conFirmarUpdatePosition(data:detallesGestion){
  
    this.datosPositionUpdate=data
  }

  winRateInfo(position:Array<detallesGestion>){
    let win:number=0
    let loss:number=0
    let winUsdt:number=0
    let lossUsdt:number=0
    let profit:number=0
    let totalOperacion:number=0
    this.list_position_open.forEach((item)=>{
     
       if(item.status==='win'){
         win++
         totalOperacion++
         winUsdt+=item.tp
       }
       if(item.status==='loss'){
        loss++
        totalOperacion++
        lossUsdt+=item.sl
       }
    })
    profit=Number((winUsdt-lossUsdt).toFixed(1))
    this.info_account.loss=loss
    this.info_account.win=win
    this.info_account.totalOperations=totalOperacion
    this.info_account.winPorcentaje=(win/totalOperacion)*100
    this.info_account.currentcapital=this.info_account.capital+profit
    this.info_account.profit=profit
    this.info_account.profitPorcentaje=Number(((profit/this.info_account.capital)*100).toFixed(1))

  }

  
conectionWs(){
    
  const subscription2= this.__wsService.onEvent('server:positionOpen'+this.idInstancia).subscribe(
    (data:any)=>{
      console.log('recibiendo position ipen ws ',data)
      if(data){
        let dataWs=JSON.parse(data)
    
        const info:detallesGestion=dataWs
        
        let candles=dataWs.candles.reverse()
           // Mostrar notificación
     
        if(info){

          info.date=this.convertirFechaUTCALocal(info.date)
        }
        const detalleGestion:detallesGestion=info
        this.toastr.success(`${detalleGestion.symbol} ${detalleGestion.side}`,'Posicion abierta!',);
        this.audioService.playNotificationSound();

        if(detalleGestion){
          this.list_position_open.unshift(detalleGestion)
          this.winRateInfo(this.list_position_open)
        }
       
      }
  
    }
  )
  this.list_subscription.push(subscription2)
  const subscription3=this.__wsService.onEvent('server:updatePositionOpen'+this.idInstancia).subscribe(
    
    (response:any)=>{
      let data=JSON.parse(response)
      console.log('position actualizada ',data)
      console.log(response)
      this.list_position_open.forEach((item)=>{
         if(String(item._id)===String(data._id)){
          item.status=data.status
          let win=data.status==='win' ? 'Ganada' : 'Perdida'
         if(win==='Ganada'){
          this.toastr.success(`${item.symbol} ${item.side}`,` Posicion ${win}`,);
          this.audioService.playNotificationSound();
          this.winRateInfo(data)

         }else if(win==='Perdida'){
          this.toastr.warning(`${item.symbol} ${item.side}`,` Posicion ${win}`,);
          this.audioService.playNotificationSound();
          this.winRateInfo(data)

         }
         
          
     

         }
      })

      this.audioService.playNotificationSound();
    },err=>{
      console.error('error alactualizar position')
    }
    
  )
  this.list_subscription.push(subscription3)
}
convertirFechaUTCALocal(fechaUTC: string): string {
  const fechaUTCObjeto = new Date(fechaUTC);
  const fechaLocalString = fechaUTCObjeto.toLocaleString();

  return fechaLocalString;
}
get_list_positions(idInstancia:string){
  const subscription =this._superTrenService.get_list_positions(idInstancia).subscribe(
    response=>{
       console.log('listolocal')
       console.log(response)
       if(response.data.length>0){
        
        this.list_position_open=(response.data.reverse())
        console.log('position open list local')
        console.log(this.list_position_open)
        this.list_position_open.forEach((item)=>{
          item.date=this.convertirFechaUTCALocal(item.date)
          if(item.candles){
            item.candles.reverse()
          }
         
        })
        this.winRateInfo(this.list_position_open)
       }
    },
    error=>{
      console.log(error)
    }
  )
  this.list_subscription.push(subscription)
}

}



