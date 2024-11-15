import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovOperadorinstRoutingModule } from './lov.operadorinst.routing';

import { LovOperadorinstComponent } from './componentes/lov.operadorinst.component';

@NgModule({
  imports: [SharedModule, LovOperadorinstRoutingModule],
  declarations: [LovOperadorinstComponent],
  exports: [LovOperadorinstComponent],
})
export class LovOperadorinstModule { }