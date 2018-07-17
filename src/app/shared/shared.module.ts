import { NgModule } from '@angular/core';
import { FullMenuComponent } from './full-menu/full-menu.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { CommonModule } from '@angular/common';
import { FormErrorPipe, ImgUrlPipe, DeviceMode } from '../pipe/form-error.pipe';
import { FormUpImgComponent } from './form/form-up-img/form-up-img.component';
import { ModalFormDataComponent } from './form/modal-form-data/modal-form-data.component';
import { ChildrenFormComponent } from './form/children-form/children-form.component';
import { InTagComponent } from './form/in-tag/in-tag.component';

const imports = [
  CommonModule,
  NgZorroAntdModule,
  FormsModule,
  ReactiveFormsModule,
];
const declarations = [
  FullMenuComponent,
  LeftMenuComponent,
  FormUpImgComponent,
  ModalFormDataComponent,
  ChildrenFormComponent,
  FormErrorPipe,
  ImgUrlPipe,
  DeviceMode,
];
@NgModule({
  imports: [
    ...imports
  ],
  declarations: [
    ...declarations,
    InTagComponent,
  ],
  exports: [
    ...imports,
    ...declarations
  ]
})
export class SharedModule { }
