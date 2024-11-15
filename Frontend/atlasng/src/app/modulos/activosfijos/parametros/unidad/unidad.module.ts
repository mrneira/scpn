import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { UnidadRoutingModule } from './unidad.routing';

import { UnidadComponent } from './componentes/unidad.component';


@NgModule({
  imports: [SharedModule, UnidadRoutingModule ],
  declarations: [UnidadComponent]
})
export class UnidadModule { }
