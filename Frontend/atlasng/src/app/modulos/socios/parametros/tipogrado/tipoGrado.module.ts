import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoGradoRoutingModule } from './tipoGrado.routing';

import {  TipoGradoComponent } from './componentes/tipoGrado.component';


@NgModule({
  imports: [SharedModule, TipoGradoRoutingModule ],
  declarations: [ TipoGradoComponent]
})
export class TipoGradoModule { }
