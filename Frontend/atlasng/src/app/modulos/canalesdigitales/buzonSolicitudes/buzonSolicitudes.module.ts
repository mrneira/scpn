import { NgModule } from '@angular/core';
import { SharedModule } from './../../../util/shared/shared.module';
import { BuzonSolicitudesRoutingModule } from './buzonSolicitudes.routing';

import { BuzonSolicitudesComponent } from './componentes/buzonSolicitudes.component';

@NgModule({
  imports: [
      SharedModule,
      BuzonSolicitudesRoutingModule,
    ],
  declarations: [
    BuzonSolicitudesComponent
    ]
})
export class BuzonSolicitudesModule { }