import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { EgresosnoefectivizadosRoutingModule } from './egresosnoefectivizados.routing';

import { EgresosnoefectivizadosComponent } from './componentes/egresosnoefectivizados.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../../personas/lov/personas/lov.personas.module'
import { LovCuentasContablesModule } from '../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, EgresosnoefectivizadosRoutingModule, JasperModule, LovPersonasModule, LovCuentasContablesModule ],
  declarations: [EgresosnoefectivizadosComponent]
})
export class EgresosnoefectivizadosModule { }
