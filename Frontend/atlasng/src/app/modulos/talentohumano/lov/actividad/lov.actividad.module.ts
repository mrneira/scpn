import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovActividadRoutingModule } from './lov.actividad.routing';
import { LovActividadComponent } from './componentes/lov.actividad.component';

@NgModule({
  imports: [SharedModule, LovActividadRoutingModule],
  declarations: [LovActividadComponent],
  exports: [LovActividadComponent]
})
export class LovActividadModule { }

