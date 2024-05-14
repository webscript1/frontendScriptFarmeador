import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Account_info, detallesGestion, gestionAtr, instanciasAuto } from '../../interfaces/interfaces-gestion';
import { Subscription } from 'rxjs';
import { SuperTrendService } from '../../services/superTrend/super-trend.service';

import { ToastrService } from 'ngx-toastr';
import { AudioService } from 'src/app/services/audio/audio.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WsService } from 'src/app/services/ws/ws.service';
import { Global } from 'src/app/services/Global';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared_data/shared_data.service';

@Component({
  selector: 'app-bot-interfaz',
  templateUrl: './bot-interfaz.component.html',
  styleUrls: ['./bot-interfaz.component.scss']
})
export class BotInterfazComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  
  public loadingActivatedBot:boolean
  public gestion_atr:gestionAtr
 
  private subscriptions: Array<Subscription>=[];
  public selectedItem:string
  public message:string
  public list_instancias:Array<gestionAtr>=[]
  public code:any
  public loading:boolean=true
  public list_orders_gestionAtr:Array<detallesGestion>
  public list_position_open:Array<detallesGestion>
  public Activador:String='manual'
  public idInstancia:any=Global.getIdInstancia() || ''
  public list_instancias_auto:Array<instanciasAuto>=[]

  miFormulario!: FormGroup;


  constructor(
    private _wsService:WsService,
    private _superTrendService:SuperTrendService,
    private toastr: ToastrService,
    private audioService: AudioService,
    private fb: FormBuilder,
    private router: Router,
    private shared_data:SharedDataService,
   
   
    
    

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
    
    if(this.idInstancia){
      this.getActivatedSymbolAuto(this.idInstancia)
    }else(
      this.get_instancias_script()
    )
    this.subInstanciasAuto()
    
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
    const sub3= this.shared_data.account_Info.subscribe(
      response=>{
       
        this.update_info_formulario(response)
      },error=>{
        console.error(error)
      }
    )
    this.subscriptions.push(sub3)
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
            if(error.status===401){
              this.toastr.warning(error.error.message);
            }  
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
 
    
    const subscription= this._wsService.onEvent('server:positionInfo'+this.idInstancia).subscribe(
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
    const subscription2= this._wsService.onEvent('server:instanciasActive'+this.idInstancia).subscribe(
      (data:any)=>{
        
        console.log('recibiendo instancias ws ws',data)
        if(data){
          const info=data
       
          if(info){
           this.list_instancias=info
           this.toastr.success('update instancias');
           this.audioService.playNotificationSound()
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
  

  update_info_formulario(info_account:Account_info){
    this.acountsizeControl?.setValue(info_account.capital)
    this.riskControl?.setValue(info_account.risk)
    this.tpRelationControl?.setValue(info_account.tprelation)
  }

  modeActivadorAuto(){
    this.Activador='auto'
  }
  modeActivadorManual(){
    this.Activador='manual'
  }
  getActivatedSymbolAuto(id:string){
   let sub= this._superTrendService.getActivatedSymbolAuto(id).subscribe(
      response=>{
        this.list_instancias=response.data
      },error=>{
        console.error(error)
      }
    )
    this.subscriptions.push(sub)
  }

  subInstanciasAuto(){
   let sub= this.shared_data.instanciasAuto.subscribe(
      response=>{
        
         this.list_instancias_auto=response
      },
      err=>{
        console.log(err)
      }   
    )
    this.subscriptions.push(sub)
  }

  updateIdInstancia(event:any){
    console.log('updateId')
    console.log(event.target.value)
    Global.setIdInstancia(event.target.value)
    window.location.reload();
    
  }


}
