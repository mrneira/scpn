import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstructurasRoutingModule } from './estructuras.routing';

import { EstructurasComponent } from './componentes/estructuras.component';


@NgModule({
  imports: [SharedModule, EstructurasRoutingModule ],
  declarations: [EstructurasComponent]
})
export class EstructurasModule { }
