import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovSuscripcionRoutingModule } from './lov.suscripcion.routing';
import { LovSuscripcionComponent } from './componentes/lov.suscripcion.component';

@NgModule({
  imports: [SharedModule, LovSuscripcionRoutingModule],
  declarations: [LovSuscripcionComponent],
  exports: [LovSuscripcionComponent]
})
export class LovSuscripcionModule { }

