import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InventarioPorTipoRoutingModule } from './inventarioPorTipo.routing';
import { InventarioPorTipoComponent } from './componentes/inventarioPorTipo.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, InventarioPorTipoRoutingModule, JasperModule, LovProductosModule, LovCuentasContablesModule ],
  declarations: [InventarioPorTipoComponent]
})
export class InventarioPorTipoModule { }
