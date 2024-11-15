import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { DocumentosReportesRoutingModule } from './documentosReportes.routing';

import { DocumentosReportesComponent } from './componentes/documentosReportes.component';


@NgModule({
  imports: [SharedModule, DocumentosReportesRoutingModule ],
  declarations: [DocumentosReportesComponent]
})
export class DocumentosReportesModule { }
