import { Component, OnInit, Inject } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { MSService } from '../../services/MS.service';

@Component({
  selector: 'app-tension',
  templateUrl: './tension.component.html',
  styleUrls: ['./tension.component.less']
})
export class TensionComponent implements OnInit {
  msg = 500;
  messages = '';
  connection: HubConnection;

  constructor(
    public _ms: MSService
  ) { }

  ngOnInit() {
  }

  F05(id, address, data) {
      this._ms.connection.invoke('F05', { Id: id, Address: address, F05: data });
  }
  F01(id, address, data) {
    this._ms.connection.invoke('F01', { Id: id, Address: address, F01: data });
    // for (let index = 0; index < 100; index++) {
    // }
    console.log(id, data);
  }
  Test() {
    this._ms.connection.invoke('Test');
    // for (let index = 0; index < 100; index++) {
    // }
  }
}
