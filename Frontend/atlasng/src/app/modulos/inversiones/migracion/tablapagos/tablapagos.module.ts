import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TablapagosRoutingModule } from './tablapagos.routing';
import { TablapagosComponent } from './componentes/tablapagos.component';

import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';

@NgModule({
  imports: [SharedModule, TablapagosRoutingModule, ResultadoCargaModule],
  declarations: [TablapagosComponent]
})
export class TablapagosModule { }
