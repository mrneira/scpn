import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DefinicionTareasRoutingModule } from './definicionTareas.routing';

import { DefinicionTareasComponent } from './componentes/definicionTareas.component';


@NgModule({
  imports: [SharedModule, DefinicionTareasRoutingModule],
  declarations: [DefinicionTareasComponent]
})
export class DefinicionTareasModule { }
