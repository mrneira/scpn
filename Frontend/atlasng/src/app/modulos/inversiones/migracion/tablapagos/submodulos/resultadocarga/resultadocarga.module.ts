import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ResultadoCargaRoutingModule } from './resultadocarga.routing';

import { ResultadoCargaComponent } from './componentes/resultadocarga.component';

@NgModule({
  imports: [SharedModule, ResultadoCargaRoutingModule ],
  declarations: [ResultadoCargaComponent],
  exports: [ResultadoCargaComponent]
})
export class ResultadoCargaModule { }
