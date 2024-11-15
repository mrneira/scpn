import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { SecuenciasRoutingModule } from './secuencias.routing';

import { SecuenciasComponent } from './componentes/secuencias.component';


@NgModule({
  imports: [SharedModule, SecuenciasRoutingModule ],
  declarations: [SecuenciasComponent]
})
export class SecuenciasModule { }
