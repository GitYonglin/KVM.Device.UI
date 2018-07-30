import { Injectable, Inject } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { DeviceParameter, ConversionName, DeviceItemName, ShowValues } from '../model/DeviceParameter';
import { PLC2Value, PLC100ms2s, Value2PLC } from '../utils/PLC8Show';

@Injectable({ providedIn: 'root' })
export class MSService {
  public nowDevice: any;
  public deviceParameter: DeviceParameter;
  public connection: HubConnection;
  public deviceLinkZ = '主站未连接';
  public deviceLinkC = '从站未连接';
  public state = {
    a1: false,
    b1: false,
    a2: false,
    b2: false,
  };
  public showValues: ShowValues = {
    a1: {
      mpa: 0,
      mm: 0
    },
    b1: {
      mpa: 0,
      mm: 0
    },
    a2: {
      mpa: 0,
      mm: 0
    },
    b2: {
      mpa: 0,
      mm: 0
    },
  };

  constructor(
    @Inject('BASE_CONFIG') private config
  ) { }

  public PLC2Value(PLCValue, name: string, key: string) {
    return this.conversionValue(PLCValue, name, key, true);
  }
  public Value2PLC(value, name: string, key: string) {
    return this.conversionValue(value, name, key, false);
  }
  private conversionValue(value, name, key, state) {
    let correction = null;
    let MpaMm = 40;
    let sensor = this.deviceParameter.mmCoefficient;
    if (name === 'mpa') {
      MpaMm = 5;
      sensor = this.deviceParameter.mpaCoefficient;
      correction = this.nowDevice[key].correction.mpa;
    } else if (name === 'mm') {
      correction = this.nowDevice[key].correction.mm;
    }
    if (state) {
      return PLC2Value(value, sensor, MpaMm, correction);
    } else {
      return Value2PLC(value, sensor, MpaMm, correction);
    }
  }
  public creation() {
    try {
      const connection = new HubConnectionBuilder().withUrl(`${this.config.uri}${'/PLC'}`).build();
      connection.start().then(r => {
        connection.on('Send', data => {
          // console.log(data);
          if (data.id === '主站') {
            this.deviceLinkZ = data.message;
            this.state.a1 = false;
            this.state.b1 = false;
          } else {
            this.deviceLinkC = data.message;
            this.state.a2 = false;
            this.state.b2 = false;
          }
        });
        connection.on('LiveData', rData => {
          if (rData.name === '主站') {
            // console.log('主站LIVE', rData.data);
            this.deviceLinkZ = '设备链接正常';
            this.state.a1 = true;
            this.state.b1 = true;
            if (this.nowDevice) {
              this.ZShowValue(rData.data);
            }
          } else {
            this.deviceLinkC = '设备链接正常';
            this.state.a2 = true;
            this.state.b2 = true;
            if (this.nowDevice) {
              this.CShowValue(rData.data);
            }
            // console.log('从站LIVE', rData.data);
          }
        });
        connection.on('DeviceParameter', rData => {
          if (rData.name === '主站') {
            console.log('主站', rData.data);
            this.setDeviceParameterValue(rData.data);
          } else {
            console.log('从站', rData.data);
          }
        });
        connection.invoke('Init');
        connection.invoke('GetDeviceParameter');
        this.connection = connection;
        console.log('链接成功', this.connection);
      }).catch((error) => {
        console.log('错误', error);
        this.anew();
      });
    } catch (error) {
      console.log(error);
      this.anew();
    }
    // this.connection.start()
    //   .then((r) => console.log('链接成功', this.connection.stop()))
    //   .catch((error) => console.log('链接失败', error)); 01 03 10 00 64 00 C8 00 0000000000000000000000C0
    // : 01 03 10 0064 00C8 0000 0000 0000 0000 0000 012C 93


  }
  // 设备参数设置
  public SetDeviceParameter(address: number, value: number, callback: Function = null) {
    this.connection.invoke('SetDeviceParameter', { address: address, value: value}).then( r => {
      callback(r);
    });
  }
  // 设备参数获取
  public setDeviceParameterValue(data) {
    const sensorMpa = data[14] / data[15] || 0;
    const sensorMm = data[14] / data[16] || 0;
    this.deviceParameter = {
      dataArr: data,
      mpaUpperLimit: PLC2Value(data[0], sensorMpa),
      returnMpa: PLC2Value(data[1], sensorMpa),
      settingMpa: PLC2Value(data[2], sensorMpa),
      oilPumpDelay: PLC100ms2s(data[3]),
      mmUpperLimit: PLC2Value(data[4], sensorMm),
      mmLowerLimit: PLC2Value(data[5], sensorMm),
      mmWorkUpperLimit: PLC2Value(data[6], sensorMm),
      mmWorkLowerLimit: PLC2Value(data[7], sensorMm),
      maximumDeviationRate: data[8],
      LowerDeviationRate: data[9],
      mpaDeviation: PLC2Value(data[10], sensorMpa),
      mmBalanceControl: PLC2Value(data[11], sensorMm),
      mmReturnLowerLimit: PLC2Value(data[12], sensorMm),
      unloadingDelay: PLC100ms2s(data[13]),
      simulationValue: data[14],
      mpaSensorUpperLimit: data[15],
      mmSensorUpperLimit: data[16],
      mpaCoefficient: sensorMpa,
      mmCoefficient: sensorMm
    };
    // localStorage.setItem('DeviceParameter', JSON.stringify(deviceParameter));
    console.log(this.deviceParameter);
  }
  private ZShowValue(data) {
    this.showValues.a1.mpa = this.PLC2Value(data[1], 'mpa', 'a1');
    this.showValues.a1.mm = this.PLC2Value(data[3], 'mm', 'a1');
    this.showValues.b1.mpa = this.PLC2Value(data[2], 'mpa', 'b1');
    this.showValues.b1.mm = this.PLC2Value(data[4], 'mm', 'b1');
  }
  private CShowValue(data) {
    this.showValues.a2.mpa = this.PLC2Value(data[1], 'mpa', 'a2');
    this.showValues.a2.mm = this.PLC2Value(data[3], 'mm', 'a2');
    this.showValues.b2.mpa = this.PLC2Value(data[2], 'mpa', 'b2');
    this.showValues.b2.mm = this.PLC2Value(data[4], 'mm', 'b2');
  }
  private anew() {
    setTimeout(() => {
      this.creation();
    }, 5000);
  }
}
