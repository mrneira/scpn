import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovContabilizacionRoutingModule } from './lov.contabilizacion.routing';

import { LovContabilizacionComponent } from './componentes/lov.contabilizacion.component';

@NgModule({
  imports: [SharedModule, LovContabilizacionRoutingModule],
  declarations: [LovContabilizacionComponent],
  exports: [LovContabilizacionComponent],
})
export class LovContabilizacionModule { }