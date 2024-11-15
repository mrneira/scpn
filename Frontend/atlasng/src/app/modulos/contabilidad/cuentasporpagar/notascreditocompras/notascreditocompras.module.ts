import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { NotasCreditoComprasRoutingModule } from './notascreditocompras.routing';
import { NotasCreditoComprasComponent } from './componentes/notascreditocompras.component';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, NotasCreditoComprasRoutingModule, LovProveedoresModule,LovCuentasContablesModule ],
  declarations: [NotasCreditoComprasComponent]
})
export class NotasCreditoComprasModule { }
