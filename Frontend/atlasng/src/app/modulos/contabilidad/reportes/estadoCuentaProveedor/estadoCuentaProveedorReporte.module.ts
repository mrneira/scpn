import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoCuentaProveedorReporteRoutingModule } from './estadoCuentaProveedorReporte.routing';

import { EstadoCuentaProveedorReporteComponent } from './componentes/estadoCuentaProveedorReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';



@NgModule({
  imports: [SharedModule, EstadoCuentaProveedorReporteRoutingModule, JasperModule, LovProveedoresModule ],
  declarations: [EstadoCuentaProveedorReporteComponent]
})
export class EstadoCuentaProveedorReporteModule { }
