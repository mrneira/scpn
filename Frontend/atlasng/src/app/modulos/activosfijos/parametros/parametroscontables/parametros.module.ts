import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ParametrosRoutingModule } from './parametros.routing';

import { ParametrosComponent } from './componentes/parametros.component';


import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
@NgModule({
  imports: [SharedModule, ParametrosRoutingModule,LovCuentasContablesModule ],
  declarations: [ParametrosComponent]
})
export class ParametrosModule { }
