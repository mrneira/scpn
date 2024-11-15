import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PrecioscierreRoutingModule } from './precioscierre.routing';
import { PrecioscierreComponent } from './componentes/precioscierre.component';

import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';

@NgModule({
  imports: [SharedModule, PrecioscierreRoutingModule, ResultadoCargaModule],
  declarations: [PrecioscierreComponent]
})
export class PrecioscierreModule { }
