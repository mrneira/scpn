import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { RecepcionDocumentoRoutingModule } from './recepcionDocumento.routing';

import { RecepcionDocumentoComponent } from './componentes/recepcionDocumento.component';

@NgModule({
  imports: [SharedModule, RecepcionDocumentoRoutingModule],
  declarations: [RecepcionDocumentoComponent]
})
export class RecepcionDocumentoModule { }
