import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {DescuentoRoutingModule  } from './descuento.routing';

import { DescuentoComponent } from './componentes/descuento.component';


@NgModule({
  imports: [SharedModule, DescuentoRoutingModule ],
  declarations: [DescuentoComponent]
})
export class DescuentoModule { }
