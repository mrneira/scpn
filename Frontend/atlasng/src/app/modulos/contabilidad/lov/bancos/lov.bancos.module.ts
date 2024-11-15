import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovBancosRoutingModule } from './lov.bancos.routing';

import { LovBancosComponent } from './componentes/lov.bancos.component';


@NgModule({
  imports: [SharedModule, LovBancosRoutingModule],
  declarations: [LovBancosComponent],
  exports: [LovBancosComponent]
})
export class LovBancosModule { }

