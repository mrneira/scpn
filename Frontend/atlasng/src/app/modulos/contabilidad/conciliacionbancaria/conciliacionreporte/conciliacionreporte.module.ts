import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConciliacionreporteRoutingModule } from './conciliacionreporte.routing';

import { ConciliacionreporteComponent } from './componentes/conciliacionreporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, ConciliacionreporteRoutingModule, JasperModule, LovPersonasModule, LovCuentasContablesModule ],
  declarations: [ConciliacionreporteComponent]
})
export class ConciliacionreporteModule { }
