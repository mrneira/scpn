import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovSociosRoutingModule } from './lov.socios.routing';

import { LovSociosComponent } from './componentes/lov.socios.component';

@NgModule({
  imports: [SharedModule, LovSociosRoutingModule],
  declarations: [LovSociosComponent],
  exports: [LovSociosComponent],
})
export class LovSociosModule { }

