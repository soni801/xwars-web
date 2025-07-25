import { Injectable } from '@angular/core';
import {io, Socket} from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.on('exception', (message: string) => {
      console.error(message);
    });
  }

  sendMessage(event: string, message: Object): Promise<any> {
    return new Promise((resolve) => {
      this.socket.emit(event, message, (ack: any) => {
        resolve(ack);
      });
    });
  }

  onMessage(event: string, callback: (message: string) => void): void {
    this.socket.on(event, callback);
  }
}
