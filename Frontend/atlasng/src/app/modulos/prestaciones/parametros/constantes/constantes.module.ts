import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConstantesRoutingModule } from './constantes.routing';

import { ConstantesComponent } from './componentes/constantes.component';


@NgModule({
  imports: [SharedModule, ConstantesRoutingModule],
  declarations: [ConstantesComponent]
})
export class ConstantesModule { }
