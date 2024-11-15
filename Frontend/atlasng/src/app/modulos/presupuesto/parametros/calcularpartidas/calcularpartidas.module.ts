import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CalcularPartidasRoutingModule } from './calcularpartidas.routing';

import { CalcularPartidasComponent } from './componentes/calcularpartidas.component';


@NgModule({
  imports: [SharedModule, CalcularPartidasRoutingModule ],
  declarations: [CalcularPartidasComponent]
})
export class CalcularPartidasModule { }
