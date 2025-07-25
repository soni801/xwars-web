import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {SocketService} from "../socket.service";
import {Player} from "../models/player.models";

@Component({
  selector: 'app-lobby-setup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './lobby-setup.html',
  styleUrl: './lobby-setup.scss'
})
export class LobbySetup implements OnInit {
  lobbyCode: string = '';
  playerName: string = '';
  playerColor: string = '';
  socketStatus: string = 'Not connected';
  socketPlayers: Player[] = [];
  ready: boolean = false;
  socketId: string | undefined;

  constructor(private socketService: SocketService) {
    this.socketService.getSocketId().then(id => this.socketId = id);
  }

  ngOnInit(): void {
    this.socketService.onMessage('join', (message: any) => {
      this.socketPlayers.push(message.player);
    });
    this.socketService.onMessage('ready', (message: any) => {
      const otherPlayer = this.socketPlayers.find(player => player.socketId !== this.socketId);
      if (!otherPlayer) throw new Error('Could not find other player. This should never happen.');
      otherPlayer.ready = message.ready;
      otherPlayer.name = message.player.name;
      otherPlayer.color = message.player.color;
    });
  }

  createLobby(): void {
    this.socketService.sendMessage('create', {"name": this.playerName, "color": this.playerColor}).then(ack => {
      this.lobbyCode = ack.code;
      this.socketStatus = 'Connected';
      this.socketPlayers = ack.players;
    });
  }

  joinLobby(): void {
    this.socketService.sendMessage('join', {"code": this.lobbyCode, "player": {"name": this.playerName, "color": this.playerColor}}).then(ack => {
      this.socketStatus = 'Connected';
      this.socketPlayers = ack.players;
    });
  }

  leaveLobby(): void {
    this.socketService.sendMessage('leave').then(() => {
      this.socketStatus = 'Not connected';
      this.socketPlayers = [];
    })
  }

  toggleReady(): void {
    this.ready = !this.ready;
    this.socketService.sendMessage('ready', {"ready": this.ready, "player": {"name": this.playerName, "color": this.playerColor}}).then(ack => {
      // Synchronize local values with socket
      this.ready = ack;
      const me = this.socketPlayers.find(player => player.socketId === this.socketId);
      if (!me) throw new Error('Could not find player. This should never happen.');
      me.ready = ack;
      me.name = this.playerName;
      me.color = this.playerColor;
    });
  }

  protected readonly JSON = JSON;
}
