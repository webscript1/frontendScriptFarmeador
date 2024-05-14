import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { instanciasAuto } from 'src/app/interfaces/interfaces-gestion';
import { SuperTrendService } from 'src/app/services/superTrend/super-trend.service';
import { Global } from 'src/app/services/Global';
import { SharedDataService } from 'src/app/services/shared_data/shared_data.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-instancias-auto',
  templateUrl: './instancias-auto.component.html',
  styleUrls: ['./instancias-auto.component.scss']
})
export class InstanciasAutoComponent implements OnDestroy, OnInit {

  public list_instancias_auto:Array<instanciasAuto>=[]
  public list_subcription:Array<Subscription>=[]
  public idInstanciaEdit:string=''
  public idInstanciaDelete:string=''
  
  public InstanciaUpdate!:instanciasAuto
  public loadig:boolean=false
  public createInstance:boolean=false
  constructor(
    private _supertrend_service:SuperTrendService,
    private _shared_data:SharedDataService,
    private toastr: ToastrService,
   
  ){

  }
  ngOnInit(): void {
    this.get_instancias_auto()
   
  }
  ngOnDestroy(): void {
    this.list_subcription.forEach((item)=>{
           item.unsubscribe()
    })
    
  }

  get_instancias_auto(){
    let sub=this._supertrend_service.getInstanciasAuto().subscribe(
      response=>{
        console.log('list inatancias auto')
        console.log(response)
        if(response){
          this.list_instancias_auto=response.data
          this._shared_data.setInstancias(this.list_instancias_auto)
          
        }
        
      },err=>{
        console.log(err)
      }
    )
    this.list_subcription.push(sub)

  }

  editOnstancia(instancia:instanciasAuto){
    if(instancia._id){
      this.idInstanciaEdit=instancia._id
      this.InstanciaUpdate= _.cloneDeep(instancia)
    }
  }
  cancelEditInstancia(){
    this.idInstanciaEdit=''
  }

  saveUpdate(instancia:instanciasAuto){
    this.loadig=true
  
  let sub= this._supertrend_service.updateInstanciasAuto(instancia).subscribe(
    response=>{
        let instanciaS:instanciasAuto=response.data
        this.list_instancias_auto.forEach((item)=>{
          if(item._id===response.data._id){
             item.account=instanciaS.account
             item.filter=instanciaS.filter
             item.intervalRsi=instanciaS.intervalRsi
             item.name=instanciaS.name
             item.positionNumer=instanciaS.positionNumer
             item.service=instanciaS.service
             item.status=instancia.status
           
          }
        })
        this.loadig=false
        this.idInstanciaEdit=''
        this.toastr.success('successfully updated instance');
    },err=>{
      this.loadig=false
        console.log(err)
    }
   )
   this.list_subcription.push(sub)

      

  }

  bottonAddInstance(event:any){
   
    this.createInstance=!this.createInstance
  }

  addInstanciaArray(instance:instanciasAuto){
    console.log('instancia redicida de hijo ',instance)
    this.list_instancias_auto.push(instance)
  

  }
  deleteInstancia(iten:instanciasAuto){
    this.loadig=true
    this.idInstanciaDelete=String(iten._id)
   const sub= this._supertrend_service.deleteInstanciasAuto(String(iten._id)).subscribe(
      response=>{
        console.log(response)
        let idElimitar=String(response.data._id)

       let instanciaSearchIndex= this.list_instancias_auto.findIndex((item)=>String(item._id)===idElimitar)
        if(instanciaSearchIndex!==-1){
          this.list_instancias_auto.splice(instanciaSearchIndex,1)
        }
        this.loadig=false
        this.toastr.success('instance deleted successfully');
        
      },error=>{
        console.log(error)
        this.loadig=false
      }
    )
    this.list_subcription.push(sub)
    
  }

}
