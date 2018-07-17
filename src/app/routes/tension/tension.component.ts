import { Component, OnInit, Inject } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';

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
    @Inject('BASE_CONFIG') private config
  ) { }

  ngOnInit() {
    this.creation();
  }
  creation() {
    try {
      const connection = new HubConnectionBuilder().withUrl(`${this.config.uri}${'/PLC'}`).build();
      connection.start().then(r => {
        connection.on('Send', data => {
          console.log(data);
          this.messages = data;
        });
        connection.invoke('Init');
        this.connection = connection;
        console.log('链接成功', this.connection);
      }).catch((error) => {
        console.log('错误', error);
      });
    } catch (error) {
      console.log(error);
    }
    // this.connection.start()
    //   .then((r) => console.log('链接成功', this.connection.stop()))
    //   .catch((error) => console.log('链接失败', error));
  }

  PLC() {
    this.connection.invoke('Start', Number(this.msg));
    // this.connection.start().then(r => {
    //   console.log('链接成功', this.connection);
    // }).catch((error) => {
    //   console.log('错误', error);
    // });
  }
  stop() {
    this.connection.invoke('Stop').then(() => {
      this.connection.stop().then(r => console.log('链接关闭', this.connection));
    }).catch((error) => {
      console.log('错误', error);
    });
  }
  F05(id, address, data) {
      this.connection.invoke('F05', { Id: id, Address: address, F05: data });
  }
  F01(id, address, data) {
    this.connection.invoke('F01', { Id: id, Address: address, F01: data });
    // for (let index = 0; index < 100; index++) {
    // }
    console.log(id, data);
  }
  Test() {
    this.connection.invoke('Test');
    // for (let index = 0; index < 100; index++) {
    // }
  }
}
