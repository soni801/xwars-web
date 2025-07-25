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

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.onMessage('join', (message: any) => {
      this.socketPlayers.push(message.player);
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
      console.log(ack);
      this.socketStatus = 'Connected';
      this.socketPlayers = ack.players;
    });
  }

  protected readonly JSON = JSON;
}
