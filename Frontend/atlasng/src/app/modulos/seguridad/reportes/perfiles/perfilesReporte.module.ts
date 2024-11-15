import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PerfilesReporteRoutingModule } from './perfilesReporte.routing';

import { PerfilesReporteComponent } from './componentes/perfilesReporte.component';
import {  } from './componentes/usuarioReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { VisorPdfModule } from '../../../../util/componentes/pdfViwer/visorPdf.module';


@NgModule({
  imports: [SharedModule, PerfilesReporteRoutingModule, JasperModule,VisorPdfModule ],
  declarations: [PerfilesReporteComponent]
})
export class PerfilesReporteModule { }
