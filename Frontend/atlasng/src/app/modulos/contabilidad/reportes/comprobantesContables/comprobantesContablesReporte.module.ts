import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ComprobantesContablesReporteRoutingModule } from './comprobantesContablesReporte.routing';
import { ComprobantesContablesReporteComponent } from './componentes/comprobantesContablesReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ComprobantesContablesReporteRoutingModule, JasperModule],
  declarations: [ComprobantesContablesReporteComponent]
})
export class ComprobantesContablesReporteModule { }
