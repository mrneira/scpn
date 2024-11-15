import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovInversionesrvRoutingModule } from './lov.inversionesrv.routing';

import { LovInversionesrvComponent } from './componentes/lov.inversionesrv.component';

@NgModule({
  imports: [SharedModule, LovInversionesrvRoutingModule],
  declarations: [LovInversionesrvComponent],
  exports: [LovInversionesrvComponent],
})
export class LovInversionesrvModule { }