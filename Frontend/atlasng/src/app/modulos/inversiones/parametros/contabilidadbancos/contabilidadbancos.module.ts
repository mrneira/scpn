import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ContabilidadbancosRoutingModule } from './contabilidadbancos.routing';

import { ContabilidadbancosComponent } from './componentes/contabilidadbancos.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, ContabilidadbancosRoutingModule, LovCuentasContablesModule],
  declarations: [ContabilidadbancosComponent]
})
export class ContabilidadbancosModule { }
