import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LibromayorRoutingModule } from './libromayor.routing';

import { LibromayorComponent } from './componentes/libromayor.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, LibromayorRoutingModule, JasperModule, LovCuentasContablesModule ],
  declarations: [LibromayorComponent]
})
export class LibromayorModule { }
