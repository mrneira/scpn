/* tslint:disable:member-ordering no-unused-variable */
import {  ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { DtoServicios } from '../servicios/dto.servicios';


@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [CommonModule, HttpModule],
  providers: [DtoServicios]
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule ya esta cargado. Import en AppModule solamente');
    }
  }
}