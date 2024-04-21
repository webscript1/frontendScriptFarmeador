import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { detallesGestion, gestionAtr } from '../../interfaces/interfaces-gestion';
import { Subscription } from 'rxjs';
import { SuperTrendService } from '../../services/superTrend/super-trend.service';

import { ToastrService } from 'ngx-toastr';
import { AudioService } from 'src/app/services/audio/audio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WsService } from 'src/app/services/ws/ws.service';
import { Global } from 'src/app/services/Global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bot-interfaz',
  templateUrl: './bot-interfaz.component.html',
  styleUrls: ['./bot-interfaz.component.scss']
})
export class BotInterfazComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  
  public loadingActivatedBot:boolean
  public gestion_atr:gestionAtr
  public detallesGestion:detallesGestion | undefined
  private subscriptions: Array<Subscription>=[];
  public selectedItem:string
  public message:string
  public list_instancias:Array<gestionAtr>=[]
  public code:any
  public loading:boolean=true
  public list_orders_gestionAtr:Array<detallesGestion>
  public list_position_open:Array<{gestion:detallesGestion,candles:Array<any>}>

  miFormulario!: FormGroup;


  constructor(
    private _wsService:WsService,
    private _superTrendService:SuperTrendService,
    private toastr: ToastrService,
    private audioService: AudioService,
    private fb: FormBuilder,
    private router: Router

  ){
    this.loadingActivatedBot=false
    this.gestion_atr={
        id:'',
        capital:0,
        risk:1,
        side:'',
        atr:0,
        entryPrice:0,
        tpRelacion:2,
        symbol:'BTCUSDT',
        date:'',
        tick:0


    }
    this.selectedItem='activador'
    this.message=''
    this.list_orders_gestionAtr=[]
    this.list_position_open=[]
  }
  ngOnDestroy(): void {
    this._wsService.disconected()

    this.subscriptions.forEach((item)=>{
       item.unsubscribe()
    })
  }
  ngAfterContentInit(): void {
    this.loading=false
  }
  ngAfterViewInit(): void {
    
  }
  ngOnInit(): void {
    this.get_instancias_script()
    this.get_list_positions_local()
    this.conectionWs()
    this.miFormulario = this.fb.group({
      // Define los campos y las validaciones aquí
      symbol: ['', Validators.required],
      acountsize: ['', [Validators.required]],
      risk: ['', [Validators.required]],
      tpRelation: ['', [Validators.required]],
      side: ['', [Validators.required]],
      // ... otros campos
    });
  }
  get symbolControl() { return this.miFormulario.get('symbol'); }
  get acountsizeControl() { return this.miFormulario.get('acountsize'); }
  get riskControl() { return this.miFormulario.get('risk'); }
  get tpRelationControl() { return this.miFormulario.get('tpRelation'); }
  get sideControl() { return this.miFormulario.get('side'); }


  selectSide(event:any){
   
    this.gestion_atr.side=event.target.value

  }

  activar_bot(){
    this.message=''
    this.loadingActivatedBot=true
     const subscription=  this._superTrendService.activarScript(this.gestion_atr).subscribe(
        response=>{
          console.log(response)
          if(response.message){
            this.message=response.message
            this.code=200
          }
          if(response.data){
            this.list_instancias.unshift(response.data)
          }
          this.loadingActivatedBot=false
        },
        error=>{
          console.log(error)
          if(error.status===409){
          
            this.message=error.error.message
            
          }
          if(error.status===404){
            this.message=error.error.message
          }
          if(error.status===401){
          
           
            Global.removeToken()
            this.router.navigate(['/'])
          }
          this.code=500
          this.loadingActivatedBot=false
        }
       )
    this.subscriptions.push(subscription)
  }

  get_instancias_script(){
    const subscription= this._superTrendService.get_instancias_script().subscribe(
      response=>{
        console.log(response)
        if(response.data){
          this.list_instancias=response.data
          console.log(this.list_instancias)
        }
      },
      error=>{
  
        console.log('estatus')
        console.log(error.status)
        if(error.status===401){
          console.log('removiendo item ')
         
          Global.removeToken()
        }
        console.log(error)
      }
    )
    this.subscriptions.push(subscription)

  }

  navegation(event:any){
    this.selectedItem=event
  }
  conectionWs(){
 
    
    const subscription= this._wsService.onEvent('server:positionInfo').subscribe(
      (data:any)=>{
        
        console.log('recibiendo data ws')
        if(data){
          const info=JSON.parse(data)
       
          if(info){
            info.date=this.convertirFechaUTCALocal(info.date)
          }
          const detalleGestion:detallesGestion=info
         
         
          if(detalleGestion){
            this.list_orders_gestionAtr.unshift(detalleGestion)
          }
          console.log(info)
        }
    
      }
    )
    this.subscriptions.push(subscription)
   
    const subscription2= this._wsService.onEvent('server:positionOpen').subscribe(
      (data:any)=>{
        console.log('recibiendo data ws')
        if(data){
          let dataWs=JSON.parse(data)
      
          const info:detallesGestion=dataWs.gestion
          let candles=dataWs.candles.reverse()
             // Mostrar notificación
       
          if(info){

            info.date=this.convertirFechaUTCALocal(info.date)
          }
          const detalleGestion:detallesGestion=info
          this.toastr.success(`${detalleGestion.symbol} ${detalleGestion.side}`,'Posicion abierta!',);
          this.audioService.playNotificationSound();

          if(detalleGestion){
            this.list_position_open.unshift({gestion:detalleGestion,candles:candles})
          }
         
        }
    
      }
    )
    this.subscriptions.push(subscription2)
     
  }

  convertirFechaUTCALocal(fechaUTC: string): string {
    const fechaUTCObjeto = new Date(fechaUTC);
    const fechaLocalString = fechaUTCObjeto.toLocaleString();
  
    return fechaLocalString;
  }
  onSubmit(){
    if (this.miFormulario.valid) {
      const formulario=this.miFormulario.value
      // Realiza acciones con los datos del formulario
      this.gestion_atr.symbol=formulario.symbol
      this.gestion_atr.capital=formulario.acountsize
      this.gestion_atr.risk=formulario.risk
      this.gestion_atr.side=formulario.side
      this.gestion_atr.tpRelacion=formulario.tpRelation
      
      
      console.log(formulario);
      this.activar_bot()
    }else{
      console.log('formulario invalido')
      console.log(this.miFormulario.value)
    }
  }
  get_list_positions_local(){
    const subscription =this._superTrendService.get_list_positions_local().subscribe(
      response=>{
     
         if(response.data.length>0){
          
          this.list_position_open=(response.data)
          console.log('position open list local')
          console.log(this.list_position_open)
          this.list_position_open.forEach((item)=>{
            item.gestion.date=this.convertirFechaUTCALocal(item.gestion.date)
            item.candles.reverse()
          })
         }
      },
      error=>{
        console.log(error)
      }
    )
    this.subscriptions.push(subscription)
  }


}
