import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { instanciasAuto } from '../../interfaces/interfaces-gestion'; 
import { SuperTrendService } from '../../services/superTrend/super-trend.service';

@Component({
  selector: 'app-create-instancia',
  templateUrl: './create-instancia.component.html',
  styleUrls: ['./create-instancia.component.scss']
})
export class CreateInstanciaComponent implements OnInit, OnDestroy{
  @Output() dataChange = new EventEmitter<any>(); 
  @Output() sendInstanciaCreate = new EventEmitter<any>(); 
  miFormulario!: FormGroup;
  public loading:boolean=false
  public list_subcription:Array<Subscription>=[]
  constructor(
    private fb: FormBuilder,
    private _super_trend:SuperTrendService,
    private toastr: ToastrService,
  ){}
  ngOnDestroy(): void {
    this.list_subcription.forEach((item)=>{
        item.unsubscribe()
    })
  }
  ngOnInit(): void {
    this.setFormulario()
  }

  setFormulario(){
    this.miFormulario = this.fb.group({
      // Define los campos y las validaciones aquí
      name: ['', Validators.required],
      capital: ['', [Validators.required]],
      risk: ['', [Validators.required]],
      tpRelation: ['', [Validators.required]],
      fee: ['', [Validators.required]],
       service: ['', [Validators.required]],
      intervalrsi: ['', [Validators.required]],
      positionN: ['', [Validators.required]],
      volume: ['', [Validators.required]],
      rsiup: ['', [Validators.required]],
      rsidown: ['', [Validators.required]],
      rsiBtcUp: ['', [Validators.required]],
      rsiBtcDown: ['', [Validators.required]],
      priceSymbol: ['', [Validators.required]],
      blacklist: ['', ],
      
      // ... otros campos
    });

 
  }
  get nameControl() { return this.miFormulario.get('name'); }
  get capitalControl() { return this.miFormulario.get('capital'); }
  get riskControl() { return this.miFormulario.get('risk'); }
  get tpRelationControl() { return this.miFormulario.get('tpRelation'); }
  get feeControl() { return this.miFormulario.get('fee'); }
  get serviceControl() { return this.miFormulario.get('service'); }
  get intervalrsiControl() { return this.miFormulario.get('intervalrsi'); }
  get positionNControl() { return this.miFormulario.get('positionN'); }
  get volumeControl() { return this.miFormulario.get('volume'); }
  get rsiupControl() { return this.miFormulario.get('rsiup'); }
  get rsidownControl() { return this.miFormulario.get('rsidown'); }
  get rsiBtcUpControl() { return this.miFormulario.get('rsiBtcUp'); }
  get rsiBtcDownControl() { return this.miFormulario.get('rsiBtcDown'); }
  get priceSymbolControl() { return this.miFormulario.get('priceSymbol'); }
  get blacklistControl() { return this.miFormulario.get('blacklist'); }

  cancelCreateInstancia() {
    this.dataChange.emit(false); // Emite el evento con datos
  }

  sendInstancia(instancia:instanciasAuto){
    this.sendInstanciaCreate.emit(instancia)
  }

  createInstancia(instancia:instanciasAuto){
    this.loading=true
   const sub= this._super_trend.createInstanciasAuto(instancia).subscribe(
      response=>{
        console.log(response)
        this.sendInstancia(response.data)
        this.loading=false
        this.toastr.success('instance created successfully');
        

      },error=>{
        console.log(error)
        this.loading=false
      }
    )
    this.list_subcription.push(sub)

  }

  onSubmit(form:FormGroup){
    this.nameControl?.value
    if(form.valid){
      const instancia:instanciasAuto={
        name: this.nameControl?.value,
        account: {
          risk: this.riskControl?.value,
          capital: this.capitalControl?.value,
          tp_relation: this.tpRelationControl?.value,
          fee: this.feeControl?.value
        },
        service: this.serviceControl?.value,
        intervalRsi: this.intervalrsiControl?.value,
        positionNumer: this.positionNControl?.value,
        status: false,
        filter: {
          volumen: this.volumeControl?.value,
          rsiUp: this.rsiupControl?.value,
          rsiDown: this.rsidownControl?.value,
          rsiBtcUp: this.rsiBtcUpControl?.value,
          rsiBtcDown: this.rsiBtcDownControl?.value,
          priceSymbol: this.priceSymbolControl?.value
        }
      }
     this.createInstancia(instancia)

    }
    
   
    

  }

}
