import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { PaisesRoutingModule } from './paises.routing';

import { PaisesComponent } from './componentes/paises.component';


@NgModule({
  imports: [SharedModule, PaisesRoutingModule ],
  declarations: [PaisesComponent]
})
export class PaisesModule { }
