import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { VisorPdfRoutingModule } from './visorPdf.routing';

import { VisorPdfComponent } from './componentes/visorPdf.component';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@NgModule({
  imports: [SharedModule, VisorPdfRoutingModule],
  declarations: [VisorPdfComponent,PdfViewerComponent],
  exports: [VisorPdfComponent],
})
export class VisorPdfModule { }

