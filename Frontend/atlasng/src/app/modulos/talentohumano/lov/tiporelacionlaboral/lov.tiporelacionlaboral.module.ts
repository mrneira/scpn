import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovTipoRelacionLaboralRoutingModule } from './lov.tiporelacionlaboral.routing';

import { LovTipoRelacionLaboralComponent } from './componentes/lov.tiporelacionlaboral.component';

@NgModule({
  imports: [SharedModule, LovTipoRelacionLaboralRoutingModule],
  declarations: [LovTipoRelacionLaboralComponent],
  exports: [LovTipoRelacionLaboralComponent],
})
export class LovTipoRelacionLaboralModule { }

