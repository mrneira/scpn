import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ParametrosRoutingModule } from './parametros.routing';

import { ParametrosComponent } from './componentes/parametros.component';


@NgModule({
  imports: [SharedModule, ParametrosRoutingModule ],
  declarations: [ParametrosComponent]
})
export class ParametrosModule { }
