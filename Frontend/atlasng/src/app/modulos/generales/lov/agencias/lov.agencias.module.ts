import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovAgenciasRoutingModule } from './lov.agencias.routing';

import { LovAgenciasComponent } from './componentes/lov.agencias.component';

@NgModule({
  imports: [SharedModule, LovAgenciasRoutingModule],
  declarations: [LovAgenciasComponent],
  exports: [LovAgenciasComponent],
})
export class LovAgenciasModule { }

