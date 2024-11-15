import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../../personas/lov/personas/lov.personas.module'
import { LovCuentasContablesModule } from '../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { ReporteconciliacionbancariaComponent } from './componentes/reporteconciliacionbancaria.component';
import { ReporteconciliacionbancariaRoutingModule } from './reporteconciliacionbancaria.routing';

@NgModule({
  imports: [SharedModule, ReporteconciliacionbancariaRoutingModule, JasperModule, LovPersonasModule, LovCuentasContablesModule ],
  declarations: [ReporteconciliacionbancariaComponent]
})
export class ReportconciliacionbancariaModule { }
