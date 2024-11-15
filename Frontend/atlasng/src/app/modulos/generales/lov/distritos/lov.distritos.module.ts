import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovDistritosRoutingModule } from './lov.distritos.routing';

import { LovDistritosComponent } from './componentes/lov.distritos.component';

@NgModule({
  imports: [SharedModule, LovDistritosRoutingModule],
  declarations: [LovDistritosComponent],
  exports: [LovDistritosComponent],
})
export class LovDistritosModule { }

