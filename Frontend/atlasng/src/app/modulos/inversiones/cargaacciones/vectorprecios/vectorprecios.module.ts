import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { VectorpreciosRoutingModule } from './vectorprecios.routing';
import { VectorpreciosComponent } from './componentes/vectorprecios.component';

import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';

@NgModule({
  imports: [SharedModule, VectorpreciosRoutingModule, ResultadoCargaModule],
  declarations: [VectorpreciosComponent]
})
export class VectorpreciosModule { }
