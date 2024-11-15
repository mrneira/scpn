import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { MonedasRoutingModule } from './monedas.routing';

import { MonedasComponent } from './componentes/monedas.component';


@NgModule({
  imports: [SharedModule, MonedasRoutingModule ],
  declarations: [MonedasComponent]
})
export class MonedasModule { }
