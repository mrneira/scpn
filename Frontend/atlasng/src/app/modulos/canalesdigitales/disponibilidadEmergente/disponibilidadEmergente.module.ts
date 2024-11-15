import { NgModule } from '@angular/core';
import { SharedModule } from './../../../util/shared/shared.module';
import { DisponibilidadEmergenteComponent } from './componentes/disponibilidadEmergente.component';
import { DisponibilidadEmergenteRoutingModule } from './disponibilidadEmergente.routing';


@NgModule({
  imports: [
      SharedModule,
      DisponibilidadEmergenteRoutingModule,
    ],
  declarations: [
      DisponibilidadEmergenteComponent
    ]
})
export class DisponibilidadEmergenteModule { }