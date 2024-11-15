import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovActasRoutingModule } from './lov.actas.routing';

import { LovActasComponent } from './componentes/lov.actas.component';


@NgModule({
  imports: [SharedModule, LovActasRoutingModule],
  declarations: [LovActasComponent],
  exports: [LovActasComponent]
})
export class LovActasModule { }

