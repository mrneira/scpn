import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { FrecuenciasRoutingModule } from './frecuencias.routing';

import { FrecuenciasComponent } from './componentes/frecuencias.component';


@NgModule({
  imports: [SharedModule, FrecuenciasRoutingModule ],
  declarations: [FrecuenciasComponent]
})
export class FrecuenciasModule { }
