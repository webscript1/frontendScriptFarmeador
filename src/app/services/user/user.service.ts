import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from '../Global';
import { Observable } from 'rxjs';
import { gestionAtr, user } from '../../interfaces/interfaces-gestion';

@Injectable({
  providedIn: 'root'
})
export class UserService {
      public token:any
      public url:any
      public version:any
    constructor(
      public http:HttpClient
    ) { 
      this.url=Global.url
      this.version=Global.url_version
      
    }

    sing_in(user:user): Observable<any>{
      this.token=Global.token()
      const params=JSON.stringify(user)
      let headers= new HttpHeaders().set('Content-Type','application/json');
      headers= headers.append('Authorization', "Bearer "+ this.token);
  
      return this.http.post(this.url+this.version+'/user/sing-in',params, {headers:headers});
   }

   sing_up(user:user): Observable<any>{
    this.token=Global.token()
    const params=JSON.stringify(user)
    let headers= new HttpHeaders().set('Content-Type','application/json');
    headers= headers.append('Authorization', "Bearer "+ this.token);

    return this.http.post(this.url+this.version+'/user/create',params, {headers:headers});
 }




}
