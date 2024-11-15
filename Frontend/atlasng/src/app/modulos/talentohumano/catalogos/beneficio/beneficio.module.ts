import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BeneficioRoutingModule } from './beneficio.routing';

import { BeneficioComponent } from './componentes/beneficio.component';


@NgModule({
  imports: [SharedModule, BeneficioRoutingModule ],
  declarations: [BeneficioComponent]
})
export class BeneficioModule { }
