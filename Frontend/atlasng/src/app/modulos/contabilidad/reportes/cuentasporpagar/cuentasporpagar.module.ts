import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CuentasporpagarRoutingModule } from './cuentasporpagar.routing';

import { CuentasporpagarComponent } from './componentes/cuentasporpagar.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';

@NgModule({
  imports: [SharedModule, CuentasporpagarRoutingModule, JasperModule, LovCuentasContablesModule, LovProveedoresModule ],
  declarations: [CuentasporpagarComponent],
  exports: [CuentasporpagarComponent]
})
export class CuentasporpagarModule { }
