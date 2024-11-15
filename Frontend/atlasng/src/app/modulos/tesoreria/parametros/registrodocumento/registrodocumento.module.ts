import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RegistroDocumentoRoutingModule } from './registrodocumento.routing';

import {RegistroDocumentoComponent } from './componentes/registrodocumento.component';


@NgModule({
  imports: [SharedModule, RegistroDocumentoRoutingModule ],
  declarations: [RegistroDocumentoComponent]
})
export class RegistroDocumentoModule { }
