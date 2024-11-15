import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MActivosReporteRoutingModule } from './mActivosReporte.routing';

import { MActivosReporteComponent } from './componentes/mActivosReporte.component';
//import {  } from './componentes/usuarioReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { VisorPdfModule } from '../../../../util/componentes/pdfViwer/visorPdf.module';

@NgModule({
  imports: [SharedModule, MActivosReporteRoutingModule, JasperModule,VisorPdfModule ],
  declarations: [MActivosReporteComponent]
})
export class MActivosReporteModule { }
