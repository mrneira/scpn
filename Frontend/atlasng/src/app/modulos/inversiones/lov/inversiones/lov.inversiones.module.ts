import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovInversionesRoutingModule } from './lov.inversiones.routing';

import { LovInversionesComponent } from './componentes/lov.inversiones.component';

@NgModule({
  imports: [SharedModule, LovInversionesRoutingModule],
  declarations: [LovInversionesComponent],
  exports: [LovInversionesComponent],
})
export class LovInversionesModule { }