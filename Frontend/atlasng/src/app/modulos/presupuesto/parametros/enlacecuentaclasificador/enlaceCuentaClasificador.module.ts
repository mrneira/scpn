import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EnlaceCuentaClasificadorRoutingModule } from './enlaceCuentaClasificador.routing';

import { EnlaceCuentaClasificadorComponent } from './componentes/enlaceCuentaClasificador.component';
import { LovClasificadorModule } from '../../lov/clasificador/lov.clasificador.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, EnlaceCuentaClasificadorRoutingModule, LovClasificadorModule, LovCuentasContablesModule ],
  declarations: [EnlaceCuentaClasificadorComponent]
})
export class EnlaceCuentaClasificadorModule { }
