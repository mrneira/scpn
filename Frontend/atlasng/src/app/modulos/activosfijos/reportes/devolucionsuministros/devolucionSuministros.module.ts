import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DevolucionSuministrosRoutingModule } from './devolucionSuministros.routing';
import { DevolucionSuministrosComponent } from './componentes/devolucionSuministros.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
@NgModule({
  imports: [SharedModule, DevolucionSuministrosRoutingModule, JasperModule, LovProductosModule, LovFuncionariosModule, LovProveedoresModule ],
  declarations: [DevolucionSuministrosComponent]
})
export class DevolucionSuministrosModule { }
