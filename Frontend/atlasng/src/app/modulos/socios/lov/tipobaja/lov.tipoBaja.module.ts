import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovTipoBajaRoutingModule } from './lov.tipoBaja.routing';

import { LovTipoBajaComponent } from './componentes/lov.tipoBaja.component';

@NgModule({
  imports: [SharedModule, LovTipoBajaRoutingModule],
  declarations: [LovTipoBajaComponent],
  exports: [LovTipoBajaComponent],
})
export class LovTipoBajaModule { }

