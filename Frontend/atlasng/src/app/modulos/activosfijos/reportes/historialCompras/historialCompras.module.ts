import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HistorialComprasRoutingModule } from './historialCompras.routing';
import { HistorialComprasComponent } from './componentes/historialCompras.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
@NgModule({
  imports: [SharedModule, HistorialComprasRoutingModule, JasperModule, LovProductosModule, LovFuncionariosModule, LovProveedoresModule ],
  declarations: [HistorialComprasComponent]
})
export class HistorialComprasModule { }
