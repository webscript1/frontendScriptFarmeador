import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Global } from '../Global';
import { Observable } from 'rxjs';
import { gestionAtr, instanciasAuto } from '../../interfaces/interfaces-gestion';


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
  let idInstancia=Global.getIdInstancia()
  this.token=Global.token()

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  if(idInstancia==='manual'){
    return this.http.delete(this.url+this.version+'/bot/detele-instancia-ws/'+id, {headers:headers});
  }else{
    return this.http.delete(this.url+this.version+'/bot/detele-instancia-ws/'+id+`/?idInstancia=${idInstancia}`, {headers:headers});
  }


}

get_list_positions(idInstancia:string,page:number): Observable<any>{
  this.token=Global.token()

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  if(idInstancia==='manual'){
    return this.http.get(this.url+this.version+`/position/get-all/?mode=${idInstancia}&page=${page}`, {headers:headers});
  }else{
    return this.http.get(this.url+this.version+`/position/get-all/?idInstancia=${idInstancia}&page=${page}`, {headers:headers});
  }

 
}
delete_position(id:string): Observable<any>{
  this.token=Global.token()

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.delete(this.url+this.version+'/position/delete/'+id, {headers:headers});
}

update_position(data:any): Observable<any>{
  this.token=Global.token()
  const params=JSON.stringify(data)

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.put(this.url+this.version+'/position/update',params, {headers:headers});
}
create_and_update_setting_account(data:any): Observable<any>{
  this.token=Global.token()
  const params=JSON.stringify(data)

  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.post(this.url+this.version+'/account/create',params, {headers:headers});
}
get_info_account(): Observable<any>{
  this.token=Global.token()


  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.get(this.url+this.version+'/account/get', {headers:headers});
}
getInstanciasAuto():Observable<any>{
  this.token=Global.token()


  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.get(this.url+this.version+'/instancia/get-all', {headers:headers});

}

getActivatedSymbolAuto(id:string):Observable<any>{
  this.token=Global.token()


  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.get(this.url+this.version+'/bot/get-instancias-script-auto/'+id, {headers:headers});

}
updateInstanciasAuto(instancia:instanciasAuto):Observable<any>{
  this.token=Global.token()
  let params=JSON.stringify(instancia)


  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.put(this.url+this.version+'/instancia/update',params, {headers:headers});

}
createInstanciasAuto(instancia:instanciasAuto):Observable<any>{
  this.token=Global.token()
  let params=JSON.stringify(instancia)


  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.post(this.url+this.version+'/instancia/create',params, {headers:headers});

}
deleteInstanciasAuto(id:string):Observable<any>{
  this.token=Global.token()
 
  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.delete(this.url+this.version+'/instancia/delete/'+id, {headers:headers});

  
}
getRsi(idInstancia:string):Observable<any>{
  this.token=Global.token()


  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);


  if(idInstancia==='manual'){
    return this.http.get(this.url+this.version+`/rsi/get-all/?mode=${idInstancia}`, {headers:headers});
  }else{
    return this.http.get(this.url+this.version+`/rsi/get-all/?idInstancia=${idInstancia}`, {headers:headers});
  }

}
deleteRsi(id:string):Observable<any>{
  this.token=Global.token()


  let headers= new HttpHeaders().set('Content-Type','application/json');
  headers= headers.append('Authorization', "Bearer "+ this.token);

  return this.http.delete(this.url+this.version+'/rsi/delete/'+id, {headers:headers});
  

}



  
}
