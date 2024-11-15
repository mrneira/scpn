import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperativocontableReporteRoutingModule } from './operativocontable.routing';

import { OperativocontableReporteComponent } from './componentes/operativocontable.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import {CheckboxModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/primeng';

import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
@NgModule({
  imports: [SharedModule, OperativocontableReporteRoutingModule, JasperModule, LovPersonasModule,MultiSelectModule, LovCuentasContablesModule,CheckboxModule,TabViewModule ],
  declarations: [OperativocontableReporteComponent]
})
export class OperativocontableReporteModule { }
