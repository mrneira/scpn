import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReporteAsignacionesRoutingModule } from './reporteAsignaciones.routing';
import { ReporteAsignacionesComponent } from './componentes/reporteAsignaciones.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProductosModule } from '../../lov/productos/lov.productos.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovProveedoresModule } from '../../../contabilidad/lov/proveedores/lov.proveedores.module';
@NgModule({
  imports: [SharedModule, ReporteAsignacionesRoutingModule, JasperModule, LovProductosModule, LovFuncionariosModule, LovProveedoresModule ],
  declarations: [ReporteAsignacionesComponent]
})
export class ReporteAsignacionesModule { }
