import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovClasificadorRoutingModule } from './lov.clasificador.routing';

import { LovClasificadorComponent } from './componentes/lov.clasificador.component';


@NgModule({
  imports: [SharedModule, LovClasificadorRoutingModule],
  declarations: [LovClasificadorComponent],
  exports: [LovClasificadorComponent]
})
export class LovClasificadorModule { }

