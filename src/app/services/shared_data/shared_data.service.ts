import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Account_info,instanciasAuto } from '../../interfaces/interfaces-gestion';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  
  public accountInfoSubject = new Subject<any>();
  public account_Info: Observable<any> = this.accountInfoSubject.asObservable();
  public InstanciasAutoSubjets= new Subject<any>();
  public instanciasAuto=this.InstanciasAutoSubjets.asObservable()
  
  constructor() { }

  

  accountInfo(account_info:Account_info){

    this.accountInfoSubject.next(account_info);
   

  }
  setInstancias(instanciasAuto:Array<instanciasAuto>){

    this.InstanciasAutoSubjets.next(instanciasAuto);
   

  }
  

}
