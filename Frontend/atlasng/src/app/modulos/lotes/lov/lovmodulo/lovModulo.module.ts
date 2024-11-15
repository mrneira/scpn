import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovModuloRoutingModule } from './lovModulo.routing';

import { LovModuloComponent } from './componentes/lovModulo.component';


@NgModule({
  imports: [SharedModule, LovModuloRoutingModule],
  declarations: [LovModuloComponent],
  exports: [LovModuloComponent]
})
export class LovModuloModule { }
