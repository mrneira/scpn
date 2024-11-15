import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoRelacionLaboralRoutingModule } from './tiporelacionlaboral.routing';

import { TipoRelacionLaboralComponent } from './componentes/tiporelacionlaboral.component';


@NgModule({
  imports: [SharedModule, TipoRelacionLaboralRoutingModule ],
  declarations: [TipoRelacionLaboralComponent]
})
export class TipoRelacionLaboralModule { }
