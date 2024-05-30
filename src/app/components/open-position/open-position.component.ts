import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Account_info, detallesGestion, gestionAtr, instanciasAuto, pagination } from '../../interfaces/interfaces-gestion';
import { SuperTrendService } from '../../services/superTrend/super-trend.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../services/shared_data/shared_data.service'; 
import { WsService } from '../../services/ws/ws.service';
import { AudioService } from '../../services/audio/audio.service';
import { Global } from '../../services/Global';
import * as _ from 'lodash';

import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { Chart } from 'chart.js/auto';


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
  public chart!:Chart
  public listProfit:Array<number>=[]
  public listLabel:Array<string>=[]
  labels: string[] = [];
  data: number[] = [];
  public lis_position_sin_reverse:Array<detallesGestion>=[]
  public volumeAccumulated:number=0
  public maxDrawdown:number=0
  public pagination:pagination={
    limit: 0,
    totalDocs: 0,
    totalPages: 0,
    page: 0,
    nextPage: 0,
    prevPage: 0
  }

  
 

  constructor (
    private _superTrenService:SuperTrendService,
    private toastr: ToastrService,
    private _shared_data:SharedDataService,
    private __wsService:WsService,
    private audioService: AudioService,
    
  ){
    this.labels = ['January', 'February', 'March', 'April', 'May'];
    this.data = [85, 72, 68, 75, 83];
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
    this.get_list_positions(this.idInstancia,1)
    this.conectionWs()
    this.getinfoInstancia()
   
   
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
      const data={
        labels:this.listLabel,
        datasets:[
          {label:'profit',
            data:this.listProfit,
            fill:false,
            borderColor:'rgb(79,192,192)',
            tension:0.1,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Chart.js Line Chart'
                }
              }
            },
          }
        ]
      }
      this.chart=new Chart('chart',{
        type:'line' as ChartType,
        data
      })
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
          this.winRateInfo()
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

  winRateInfo(){
    this.volumeAccumulated=0
    this.listProfit=[]
    let win:number=0
    let loss:number=0
    let winUsdt:number=0
    let lossUsdt:number=0
    let profit:number=0
    let totalOperacion:number=0
    let capitalCurrent=this.info_account.capital
    let i=0
    let list_sl_and_tp:Array<number>=[]
    this.listProfit.push(capitalCurrent)
    for (const item of this.lis_position_sin_reverse) {
      
    
     
       if(item.status==='win'){
        i++
         this.listLabel.push(String(i))
         win++
         totalOperacion++
         winUsdt+=item.tp
        const p= Number((capitalCurrent+item.tp).toFixed(2))
         this.listProfit.push(p)
         
         capitalCurrent=capitalCurrent+ item.tp
         this.volumeAccumulated+=item.qty*item.entryPrice
         list_sl_and_tp.push(item.tp)
         
       }
       if(item.status==='loss'){
        i++
         this.listLabel.push(String(i))
        loss++
        totalOperacion++
        lossUsdt+=item.sl
        const p= Number((capitalCurrent-item.sl).toFixed(2))

        this.listProfit.push(p)
       
        capitalCurrent=capitalCurrent- item.sl
        this.volumeAccumulated+=item.qty*item.entryPrice
        list_sl_and_tp.push(-item.sl)

        
       }
    }
   
    //this.calculoDrawDown(list_sl_and_tp)
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
          this.lis_position_sin_reverse.push(detalleGestion)
        }
       
      }
  
    }
  )
  this.list_subscription.push(subscription2)
  const subscription3=this.__wsService.onEvent('server:updatePositionOpen'+this.idInstancia).subscribe(
    
    (response:any)=>{
      let data=JSON.parse(response)
    
      this.list_position_open.forEach((item)=>{
         if(String(item._id)===String(data._id)){
          item.status=data.status
        
          
          let win=data.status==='win' ? 'Ganada' : 'Perdida'
          
         if(win==='Ganada'){
          this.toastr.success(`${item.symbol} ${item.side}`,` Posicion ${win}`,);
          this.audioService.playNotificationSound();
          
      

         }else if(win==='Perdida'){
          this.toastr.warning(`${item.symbol} ${item.side}`,` Posicion ${win}`,);
          this.audioService.playNotificationSound();
          
          

         }
         
          
     

         }
      })
      this.lis_position_sin_reverse.forEach((item)=>{
        if(String(item._id)===String(data._id)){
          item.status=data.status
          
        }
      })
      this.winRateInfo()

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
get_list_positions(idInstancia:string,page:number){
  console.log('page: ',page)
  const subscription =this._superTrenService.get_list_positions(idInstancia,page).subscribe(
    response=>{
      let docs=response.data.docs
      this.pagination.limit=response.data.limit
      this.pagination.page=response.data.page
      this.pagination.totalDocs=response.data.totalDocs
      this.pagination.totalPages=response.data.totalPages
      this.pagination.nextPage=response.data.nextPage
      this.pagination.prevPage=response.data.prevPage
       console.log('listolocal')
       console.log(response)
       if(docs.length>0){
   
        this.lis_position_sin_reverse= _.cloneDeep(docs)
        this.list_position_open=docs.reverse()
        
        
       
        console.log('position open list local')
        console.log(this.list_position_open)
        this.list_position_open.forEach((item)=>{
          item.date=this.convertirFechaUTCALocal(item.date)
          if(item.candles){
            item.candles.reverse()
          }
         
        })
        this.winRateInfo()
       }
    },
    error=>{
      console.log(error)
    }
  )
  this.list_subscription.push(subscription)
}

calculoDrawDown(listProfit:Array<number>){
  if (!listProfit.length) return 0; // Manejar lista vacía

  let peak = listProfit[0]; // Inicializar peak con el primer valor
  let drawdown = 0;
  let i=0
  let usdt=0

  for (const profit of listProfit) {
    
    peak = Math.max(peak, profit); // Actualizar peak si el profit es mayor
    drawdown = Math.max(drawdown, peak - profit); // Calcular drawdown basado en peak
    console.log(i+'draw ',drawdown)
    i++
  }

  this.maxDrawdown=drawdown
  console.log('draw down: ',drawdown)

  return drawdown;
}
getinfoInstancia(){
  let sub=  this._shared_data.instanciasAuto.subscribe(
    (response:Array<instanciasAuto>)=>{
      let idInstancia=Global.getIdInstancia()
     if(idInstancia){
      response.forEach((item)=>{
        if(idInstancia===item._id){
         this.info_account.capital=item.account.capital
        }
   })
     }
      
      
  
    },error=>{
  
    }
   )
   this.list_subscription.push(sub)
   
  }
   range(n:number) {
    const result = [];
    let count=0
    for (let i=this.pagination.page ; i <= n+5; i++) {
      result.push(i);
      count++
      if(count>=5){
        break
      }
    }
    return result;
  }

}



