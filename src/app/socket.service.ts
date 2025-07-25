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

  getSocketId(): Promise<string> {
    return new Promise((resolve) => {
      if (this.socket.connected) {
        if (!this.socket.id) throw new Error('Socket ID is not set. This should never happen.');
        resolve(this.socket.id);
      } else {
        this.socket.on('connect', () => {
          if (!this.socket.id) throw new Error('Socket ID is not set. This should never happen.');
          resolve(this.socket.id);
        });
      }
    });
  }

  sendMessage(event: string, message?: Object): Promise<any> {
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
