import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RentafijaRoutingModule } from './rentafija.routing';
import { RentafijaComponent } from './componentes/rentafija.component';

import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';

@NgModule({
  imports: [SharedModule, RentafijaRoutingModule, ResultadoCargaModule],
  declarations: [RentafijaComponent]
})
export class RentafijaModule { }
