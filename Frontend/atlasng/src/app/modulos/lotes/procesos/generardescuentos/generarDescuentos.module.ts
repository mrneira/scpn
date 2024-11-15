import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { GenerarDescuentosRoutingModule } from './generarDescuentos.routing';

import { GenerarDescuentosComponent } from './componentes/generarDescuentos.component';

@NgModule({
  imports: [SharedModule, GenerarDescuentosRoutingModule],
  declarations: [GenerarDescuentosComponent]
})
export class GenerarDescuentosModule { }
