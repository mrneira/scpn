import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovSolicitudesRoutingModule } from './lov.solicitudes.routing';
import { LovSolicitudesComponent } from './componentes/lov.solicitudes.component';

@NgModule({
  imports: [SharedModule, LovSolicitudesRoutingModule],
  declarations: [LovSolicitudesComponent],
  exports: [LovSolicitudesComponent]
})
export class LovSolicitudesModule { }

