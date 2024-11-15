import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovSegurosRoutingModule } from './lov.seguros.routing';

import { LovSegurosComponent } from './componentes/lov.seguros.component';


@NgModule({
  imports: [SharedModule, LovSegurosRoutingModule],
  declarations: [LovSegurosComponent],
  exports: [LovSegurosComponent]
})
export class LovSegurosModule { }

