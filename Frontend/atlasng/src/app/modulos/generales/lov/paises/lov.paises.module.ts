import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPaisesRoutingModule } from './lov.paises.routing';

import { LovPaisesComponent } from './componentes/lov.paises.component';

@NgModule({
  imports: [SharedModule, LovPaisesRoutingModule],
  declarations: [LovPaisesComponent],
  exports: [LovPaisesComponent],
})
export class LovPaisesModule { }

