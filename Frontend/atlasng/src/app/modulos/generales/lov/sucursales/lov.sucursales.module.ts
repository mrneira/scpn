import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovSucursalesRoutingModule } from './lov.sucursales.routing';

import { LovSucursalesComponent } from './componentes/lov.sucursales.component';

@NgModule({
  imports: [SharedModule, LovSucursalesRoutingModule],
  declarations: [LovSucursalesComponent],
  exports: [LovSucursalesComponent],
})
export class LovSucursalesModule { }

