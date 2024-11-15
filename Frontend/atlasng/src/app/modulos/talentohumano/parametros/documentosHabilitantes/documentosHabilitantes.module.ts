import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DocumentosHabilitantesRoutingModule } from './documentosHabilitantes.routing';

import { DocumentosHabilitantesComponent } from './componentes/documentosHabilitantes.component';


@NgModule({
  imports: [SharedModule, DocumentosHabilitantesRoutingModule ],
  declarations: [DocumentosHabilitantesComponent]
})
export class DocumentosHabilitantesModule { }
