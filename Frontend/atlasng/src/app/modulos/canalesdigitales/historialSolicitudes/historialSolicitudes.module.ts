import { NgModule } from '@angular/core';
import { SharedModule } from './../../../util/shared/shared.module';
import { HistorialSolicitudesComponent } from './componentes/historialSolicitudes.component';
import { HistorialSolicitudesRoutingModule } from './historialSolicitudes.routing';


@NgModule({
  imports: [
      SharedModule,
      HistorialSolicitudesRoutingModule,
    ],
  declarations: [
    HistorialSolicitudesComponent
    ]
})
export class HistorialSolicitudesModule { }