import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovOperacionGarRoutingModule } from './lov.operacionGar.routing';

import { LovOperacionGarComponent } from './componentes/lov.operacionGar.component';


@NgModule({
  imports: [SharedModule, LovOperacionGarRoutingModule],
  declarations: [LovOperacionGarComponent],
  exports: [LovOperacionGarComponent]
})
export class LovOperacionGarModule { }

