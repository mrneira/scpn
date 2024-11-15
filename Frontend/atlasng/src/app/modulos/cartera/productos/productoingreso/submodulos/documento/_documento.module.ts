import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DocumentoRoutingModule } from './_documento.routing';
import { DocumentoComponent } from './componentes/_documento.component';


;

@NgModule({
  imports: [SharedModule, DocumentoRoutingModule ],
  declarations: [DocumentoComponent],
  exports: [DocumentoComponent]
})
export class DocumentoModule { }
