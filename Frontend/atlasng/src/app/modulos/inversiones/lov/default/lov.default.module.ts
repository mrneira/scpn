import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovDefaultRoutingModule } from './lov.default.routing';

import { LovDefaultComponent } from './componentes/lov.default.component';

@NgModule({
  imports: [SharedModule, LovDefaultRoutingModule],
  declarations: [LovDefaultComponent],
  exports: [LovDefaultComponent],
})
export class LovDefaultModule { }