import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DocumentosHabilitantesRoutingModule } from './documentoshabilitantes.routing';

import { DocumentosHabilitantesComponent } from './componentes/documentoshabilitantes.component';


@NgModule({
  imports: [SharedModule, DocumentosHabilitantesRoutingModule ],
  declarations: [DocumentosHabilitantesComponent]
})
export class DocumentosHabilitantesModule { }
