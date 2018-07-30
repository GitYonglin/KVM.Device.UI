import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { APIService } from '../../services/api.service';
import { DeviceParameter } from '../../model/DeviceParameter';
import { MSService } from '../../services/MS.service';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.less']
})
export class ManualComponent implements OnInit {
  devices = [];
  a1 = {
    state: true,
    setMpa: 0,
    setMm: 0,
    nowMpa: 5,
    nowMm: 10,
  };
  a2 = {
    state: true,
    setMpa: 0,
    setMm: 0,
    nowMpa: 5,
    nowMm: 10,
  };
  b1 = {
    state: true,
    setMpa: 0,
    setMm: 0,
    nowMpa: 5,
    nowMm: 10,
  };
  b2 = {
    state: true,
    setMpa: 0,
    setMm: 0,
    nowMpa: 5,
    nowMm: 10,
  };
  nowValue = 0;
  realityValue = 0;
  correctionValue = 0;
  enforcement = false;
  autoState = false;
  correctionState = false;
  deviceName = '';
  correctionName = '';
  nowSetItem = null;
  nowKey = null;
  selectDeviceId = null;
  // deviceParameter: DeviceParameter;
  correctionIndex: any;

  @Input()
    deviceData: any;
  @Output()
    saveCorrectionValue =  new EventEmitter<any>();

  constructor(
    private _service: APIService,
    public _ms: MSService
  ) { }

  ngOnInit() {
    // this.deviceParameter = JSON.parse(localStorage.getItem('DeviceParameter'));
    this._service.get('/device').subscribe(p => {
      console.log('000000000', p);
      if (p) {
        this.devices = p;
        this.selectDeviceId = localStorage.getItem('nowDevice');
        this.onSwitchDevice();
      } else {
        this.devices = [];
      }
    });
  }
  onA1State() {
    this.a1.state = !this.a1.state;
  }
  onA2State() {
    this.a2.state = !this.a2.state;
  }
  onB1State() {
    this.b1.state = !this.b1.state;
  }
  onB2State() {
    this.b2.state = !this.b2.state;
  }
  onEnforcement() {
    this.enforcement = !this.enforcement;
  }
  onAutoState() {
    this.autoState = !this.autoState;
  }
  public onCorrection(state, deviceName, name) {
    this.correctionState = state;
    this.deviceName = deviceName;
    this.correctionName = name;
    this.nowSetItem = null;
    this.nowKey = null;
    this.a1.state = false;
    this.a2.state = false;
    this.b1.state = false;
    this.b2.state = false;
    this[this.correctionName].state = true;
  }
  public onSetCorrection(name: string, key: string, i) {
    this.nowSetItem = name;
    this.nowKey = key;
    const reg  = /\[(.+?)\]/;
    this.correctionIndex  = key.match(reg)[1];
    if (name.indexOf('Mpa') !== -1) {
      this[this.correctionName].setMpa = Number(name.slice(0, name.length - 3));
      this[this.correctionName].setMm = 0;
    } else {
      this[this.correctionName].setMm = Number(name.slice(0, name.length - 2));
      this[this.correctionName].setMpa = 3;
    }
  }
  // 保存校正值
  onSaveCorrectionValue() {
    if (this.nowSetItem.indexOf('Mpa') !== -1) {
      this.deviceData[this.correctionName].correction.mpa[this.correctionIndex] = this.correctionValue;
    } else {
      this.deviceData[this.correctionName].correction.mm[this.correctionIndex] = this.correctionValue;
    }
    this.saveCorrectionValue.emit({key: this.nowKey, value: this.correctionValue});
    this._ms.nowDevice = this.deviceData;
  }
  // 计算校准值
  calculate() {
    this.correctionValue = Number((this.nowValue / this.realityValue).toFixed(4));
  }
  // 获取设备值
  getNowValue() {
    const name = this.nowSetItem;
    if (name.indexOf('Mpa') !== -1) {
      this.nowValue = this[this.correctionName].nowMpa;
    } else {
      this.nowValue = this[this.correctionName].nowMm;
    }
    this.calculate();
  }
  // 切换泵顶组
  onSwitchDevice() {
    localStorage.setItem('nowDevice', this.selectDeviceId);
    this._service.get(`/device/${this.selectDeviceId}`).subscribe(r => {
      this.deviceData = r;
      this._ms.nowDevice = this.deviceData;
    });
    console.log(this.deviceData);
  }
}
