import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoCuentaClienteReporteRoutingModule } from './estadoCuentaClienteReporte.routing';

import { EstadoCuentaClienteReporteComponent } from './componentes/estadoCuentaClienteReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovClientesModule } from '../../lov/clientes/lov.clientes.module';


@NgModule({
  imports: [SharedModule, EstadoCuentaClienteReporteRoutingModule, JasperModule, LovClientesModule ],
  declarations: [EstadoCuentaClienteReporteComponent]
})
export class EstadoCuentaClienteReporteModule { }
