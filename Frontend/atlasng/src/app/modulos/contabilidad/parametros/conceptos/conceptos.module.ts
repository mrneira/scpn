import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ModulosRoutingModule } from './conceptos.routing';

import { ConceptosComponent } from './componentes/conceptos.component';


@NgModule({
  imports: [SharedModule, ModulosRoutingModule ],
  declarations: [ConceptosComponent]
})
export class ConceptosModule { }
