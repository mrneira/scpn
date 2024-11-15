import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovTipoVinculacionRoutingModule } from './lov.tipovinculacion.routing';

import { LovTipoVinculacionComponent } from './componentes/lov.tipovinculacion.component';

@NgModule({
  imports: [SharedModule, LovTipoVinculacionRoutingModule],
  declarations: [LovTipoVinculacionComponent],
  exports: [LovTipoVinculacionComponent],
})
export class LovTipoVinculacionModule { }

