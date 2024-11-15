import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { FeriadosRoutingModule } from './feriados.routing';

import { FeriadosComponent } from './componentes/feriados.component';


@NgModule({
  imports: [SharedModule, FeriadosRoutingModule ],
  declarations: [FeriadosComponent]
})
export class FeriadosModule { }
