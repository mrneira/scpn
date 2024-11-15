import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovProvinciasRoutingModule } from './lov.provincias.routing';

import { LovProvinciasComponent } from './componentes/lov.provincias.component';

@NgModule({
  imports: [SharedModule, LovProvinciasRoutingModule],
  declarations: [LovProvinciasComponent],
  exports: [LovProvinciasComponent],
})
export class LovProvinciasModule { }

