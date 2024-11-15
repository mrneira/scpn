import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovIdiomasRoutingModule } from './lov.idiomas.routing';

import { LovIdiomasComponent } from './componentes/lov.idiomas.component';

@NgModule({
  imports: [SharedModule, LovIdiomasRoutingModule],
  declarations: [LovIdiomasComponent],
  exports: [LovIdiomasComponent],
})
export class LovIdiomasModule { }

