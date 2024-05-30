import { Component, OnDestroy } from '@angular/core';
import { detallesGestion, gestionAtr } from '../../interfaces/interfaces-gestion';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SuperTrendService } from '../../services/superTrend/super-trend.service';
import { HttpClientModule } from '@angular/common/http'
import {provideHttpClient} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-calculadora-gestion',
  templateUrl: './calculadora-gestion.component.html',
  styleUrls: ['./calculadora-gestion.component.scss'],
 
 
 

  
})
export class CalculadoraGestionComponent implements OnDestroy{
  public loadingCalcularGestion:boolean
  public gestion_atr:gestionAtr
  public detallesGestion:detallesGestion | undefined
  private subscriptions: Array<Subscription>=[];

  constructor(
    private _superTrendService:SuperTrendService,

  ){
    this.loadingCalcularGestion=false
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
    
  
  }
  ngOnDestroy(): void {
      // Desuscribirse de todas las suscripciones
      for (const subscription of this.subscriptions) {
        subscription.unsubscribe();
      }
     
  }

  selectSide(event:any){
   
    this.gestion_atr.side=event.target.value

  }

  calcular_gestion(){
    this.loadingCalcularGestion=true
    const subscription= this._superTrendService.calcularGestion(this.gestion_atr).subscribe(
      response=>{
        console.log(response)
        if(response.data){
          this.detallesGestion=response.data

        }
        this.loadingCalcularGestion=false
      },
      error=>{
        console.log(error)
        this.loadingCalcularGestion=false
      }
     )
     this.subscriptions.push(subscription)
  }

}
