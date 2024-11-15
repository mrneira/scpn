import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BcetasasaportesRoutingModule } from './bcetasasaportes.routing';

import { BcetasasaportesComponent } from './componentes/bcetasasaportes.component';


@NgModule({
  imports: [SharedModule, BcetasasaportesRoutingModule ],
  declarations: [BcetasasaportesComponent]
})
export class BcetasasaportesModule { }
