import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Account_info } from 'src/app/interfaces/interfaces-gestion';
import { SharedDataService } from 'src/app/services/shared_data/shared_data.service';
import { SuperTrendService } from 'src/app/services/superTrend/super-trend.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy{

  public account_info:Account_info={
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
  public list_subcroption:Array<Subscription>=[]

  constructor(
    private _supertrenService:SuperTrendService,
    private _shared_data:SharedDataService,
    private toastr: ToastrService,
  ){

  }
  ngOnDestroy(): void {
    this.list_subcroption.forEach((item)=>{
           item.unsubscribe()
    })

  }
  ngOnInit(): void {
    this.get_info_account()
    
  }

  create_and_update_setting(){
    let data={
      id:this.account_info._id,
      capital:this.account_info.capital,
      risk:this.account_info.risk,
      tprelation:this.account_info.tprelation
    }
   const sub2= this._supertrenService.create_and_update_setting_account(data).subscribe(
      response=>{
        console.log(response)
        if(response.code===200 || response.code===201){
          this.toastr.success(response.message);
          this._shared_data.accountInfo(response.data)
        

        }
      },err=>{
        console.error(err)
        if(err.status===401){
          this.toastr.warning(err.error.message);
        }  
      }
    )
    this.list_subcroption.push(sub2)
  }

  get_info_account(){
   const sub1= this._supertrenService.get_info_account().subscribe(
      response=>{
        console.log('info account')
        console.log(response)
        this.account_info=response.data
        this._shared_data.accountInfo(response.data)
      },
      error=>{
        console.error(error)
      }
    )
    this.list_subcroption.push(sub1)
  }

}
