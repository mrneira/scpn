import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ModulosRoutingModule } from './nivel.routing';

import { NivelComponent } from './componentes/nivel.component';


@NgModule({
  imports: [SharedModule, ModulosRoutingModule ],
  declarations: [NivelComponent]
})
export class NivelModule { }
