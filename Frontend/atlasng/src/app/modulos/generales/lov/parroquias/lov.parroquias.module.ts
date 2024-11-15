import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovParroquiasRoutingModule } from './lov.parroquias.routing';

import { LovParroquiasComponent } from './componentes/lov.parroquias.component';

@NgModule({
  imports: [SharedModule, LovParroquiasRoutingModule],
  declarations: [LovParroquiasComponent],
  exports: [LovParroquiasComponent],
})
export class LovParroquiasModule { }
