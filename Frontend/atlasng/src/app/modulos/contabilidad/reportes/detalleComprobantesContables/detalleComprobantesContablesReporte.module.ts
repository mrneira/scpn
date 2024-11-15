import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { DetalleComprobantesContablesReporteComponent } from './componentes/detalleComprobantesContablesReporte.component';
import { DetalleComprobantesContablesReporteRoutingModule } from './detalleComprobantesContablesReporte.routing';

@NgModule({
  imports: [SharedModule, DetalleComprobantesContablesReporteRoutingModule, JasperModule],
  declarations: [DetalleComprobantesContablesReporteComponent]
})
export class DetalleComprobantesContablesReporteModule { }
