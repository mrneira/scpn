import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DevolucionComprasRoutingModule } from './devolucionCompras.routing';
import { DevolucionComprasComponent } from './componentes/devolucionCompras.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
@NgModule({
  imports: [SharedModule, DevolucionComprasRoutingModule, JasperModule, LovProductosModule, LovFuncionariosModule, LovProveedoresModule ],
  declarations: [DevolucionComprasComponent]
})
export class DevolucionComprasModule { }
