import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ContabilidadbolsaRoutingModule } from './contabilidadbolsa.routing';

import { ContabilidadbolsaComponent } from './componentes/contabilidadbolsa.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, ContabilidadbolsaRoutingModule, LovCuentasContablesModule],
  declarations: [ContabilidadbolsaComponent]
})
export class ContabilidadbolsaModule { }
