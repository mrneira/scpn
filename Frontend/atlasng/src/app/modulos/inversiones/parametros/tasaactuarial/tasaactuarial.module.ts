import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ParametrosRoutingModule } from './tasaactuarial.routing';

import { TasaactuarialComponent } from './componentes/tasaactuarial.component';


@NgModule({
  imports: [SharedModule, ParametrosRoutingModule ],
  declarations: [TasaactuarialComponent]
})
export class TasaActuarialModule { }
