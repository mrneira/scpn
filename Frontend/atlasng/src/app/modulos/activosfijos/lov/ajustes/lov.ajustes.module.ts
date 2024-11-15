import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovAjustesRoutingModule } from './lov.ajustes.routing';

import { LovAjustesComponent } from './componentes/lov.ajustes.component';


@NgModule({
  imports: [SharedModule, LovAjustesRoutingModule],
  declarations: [LovAjustesComponent],
  exports: [LovAjustesComponent]
})
export class LovAjustesModule { }

