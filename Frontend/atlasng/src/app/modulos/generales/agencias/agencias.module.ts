import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AgenciasRoutingModule } from './agencias.routing';

import { AgenciasComponent } from './componentes/agencias.component';


@NgModule({
  imports: [SharedModule, AgenciasRoutingModule ],
  declarations: [AgenciasComponent]
})
export class AgenciasModule { }
