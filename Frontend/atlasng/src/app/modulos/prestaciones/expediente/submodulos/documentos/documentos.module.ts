import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { DocuentosRoutingModule } from './documentos.routing';

import { DocumentosComponent } from './componentes/documentos.component';

import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';


@NgModule({
  imports: [SharedModule, DocuentosRoutingModule, LovPersonasModule ],
  declarations: [DocumentosComponent],
  exports: [DocumentosComponent]
})
export class DocumentosModule { }
