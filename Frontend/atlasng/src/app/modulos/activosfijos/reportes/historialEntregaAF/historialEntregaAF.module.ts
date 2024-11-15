import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HistorialEntregaAFRoutingModule } from './historialEntregaAF.routing';
import { HistorialEntregaAFComponent } from './componentes/historialEntregaAF.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
@NgModule({
  imports: [SharedModule, HistorialEntregaAFRoutingModule, JasperModule, LovProductosModule, LovFuncionariosModule, LovProveedoresModule ],
  declarations: [HistorialEntregaAFComponent]
})
export class HistorialEntregaAFModule { }
