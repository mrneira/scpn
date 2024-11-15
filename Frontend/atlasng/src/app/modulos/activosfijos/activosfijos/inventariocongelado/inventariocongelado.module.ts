import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InventarioCongeladoRoutingModule } from './inventariocongelado.routing';

import { InventarioCongeladoComponent } from './componentes/inventariocongelado.component';


@NgModule({
  imports: [SharedModule, InventarioCongeladoRoutingModule ],
  declarations: [InventarioCongeladoComponent]
})
export class InventarioCongeladoModule { }
