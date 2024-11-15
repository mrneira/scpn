import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ParametrosCuantiaRoutingModule } from './parametroscuantia.routing';

import { ParametrosCuantiaComponent } from './componentes/parametroscuantia.component';


@NgModule({
  imports: [SharedModule, ParametrosCuantiaRoutingModule],
  declarations: [ParametrosCuantiaComponent]
})
export class ParametrosCuantiaModule { }
