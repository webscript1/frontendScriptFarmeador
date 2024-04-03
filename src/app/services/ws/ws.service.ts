import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Global } from '../Global';
@Injectable({
  providedIn: 'root'
})
export class WsService {
  
  private socket: Socket
  private url:string
  constructor( ) {
    this.url=Global.url
    this.socket = new Socket({ url: this.url });
  }

  // Método para emitir un evento
  emitEvent(eventName: string, data: any) {
  
      this.socket.emit(eventName, data);
    
  
  }

  // Método para escuchar un evento
  onEvent(eventName: string) {
  
    return this.socket.fromEvent(eventName);
  
  }
  disconected(){
    this.socket.disconnect()
  }

}
