import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CruceNotasCreditoComprasRoutingModule } from './crucenotascreditocompras.routing';
import { CruceNotasCreditoComprasComponent } from './componentes/crucenotascreditocompras.component';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { LovCuentasporpagarModule } from '../../lov/cuentasporpagar/lov.cuentasporpagar.module';

@NgModule({
  imports: [SharedModule, CruceNotasCreditoComprasRoutingModule, LovProveedoresModule,LovCuentasporpagarModule ],
  declarations: [CruceNotasCreditoComprasComponent]
})
export class CruceNotasCreditoComprasModule { }
