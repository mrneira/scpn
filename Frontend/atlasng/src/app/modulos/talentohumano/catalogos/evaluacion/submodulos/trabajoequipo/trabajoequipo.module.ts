import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { TrabajoequipoRoutingModule } from './trabajoequipo.routing';

import { TrabajoequipoComponent } from './componentes/trabajoequipo.component';


@NgModule({
  imports: [SharedModule, TrabajoequipoRoutingModule],
  declarations: [TrabajoequipoComponent],
  exports: [TrabajoequipoComponent]
})
export class TrabajoequipoModule { }
