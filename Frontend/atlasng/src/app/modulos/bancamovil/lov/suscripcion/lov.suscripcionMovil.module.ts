import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovSuscripcionMovilRoutingModule } from './lov.suscripcionMovil.routing';
import { LovSuscripcionMovilComponent } from './componentes/lov.suscripcionMovil.component';

@NgModule({
  imports: [SharedModule, LovSuscripcionMovilRoutingModule],
  declarations: [LovSuscripcionMovilComponent],
  exports: [LovSuscripcionMovilComponent]
})
export class LovSuscripcionMovilModule { }

