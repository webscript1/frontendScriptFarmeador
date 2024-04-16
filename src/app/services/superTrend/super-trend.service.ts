import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Global } from '../Global';
import { Observable } from 'rxjs';
import { gestionAtr } from '../../interfaces/interfaces-gestion';


@Injectable({
  providedIn: 'root',
})
export class SuperTrendService {
   public token:any
   public url:any
   public version:any
  constructor(
    public http:HttpClient
  ) { 
    this.url=Global.url
    this.version=Global.url_version
   
  }

  calcularGestion(gestion:gestionAtr): Observable<any>{
    this.token=Global.token()
    const params=JSON.stringify(gestion)
    let headers= new HttpHeaders().set('Content-Type','application/json');
    headers= headers.append('Authorization', "Bearer "+ this.token);

    return this.http.post(this.url+this.version+'/bot/calcular-gestion-atr',params, {headers:headers});
 }
 activarScript(gestion:gestionAtr): Observable<any>{
  this.token=Global.token()
  const params=JSON.stringify(gestion)
  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.post(this.url+this.version+'/bot/activar-script-bybit',params, {headers:headers});
}
get_instancias_script(): Observable<any>{
  this.token=Global.token()

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.get(this.url+this.version+'/bot/get-instancias-script', {headers:headers});
}
deleteInstancia(id:any): Observable<any>{
  this.token=Global.token()

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.delete(this.url+this.version+'/bot/detele-instancia-ws/'+id, {headers:headers});
}

get_list_positions_local(): Observable<any>{
  this.token=Global.token()

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.get(this.url+this.version+'/bot/get-list-position-open', {headers:headers});
}
delete_position_list_local(id:string): Observable<any>{
  this.token=Global.token()

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.delete(this.url+this.version+'/bot/delete-position-of-list-local/'+id, {headers:headers});
}


  
}
