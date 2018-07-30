import { Component, OnInit, Input } from '@angular/core';
import { Value2PLC } from '../../../utils/PLC8Show';
import { DeviceParameter, ShowValues } from '../../../model/DeviceParameter';
import { MSService } from '../../../services/MS.service';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.less']
})
export class DeviceItemComponent implements OnInit {
  @Input()
  name: string;
  @Input()
  data: any;
  @Input()
  disabled = false;

  constructor(public _ms: MSService) { }

  ngOnInit() {
  }

  onSet(address: number, make) {
    let value = this.data.setMpa;
    if (make === 'mm') {
      value = this.data.setMm;
    }
    value = this._ms.Value2PLC( value, make, this.name);
    console.log(value);
  }
}
