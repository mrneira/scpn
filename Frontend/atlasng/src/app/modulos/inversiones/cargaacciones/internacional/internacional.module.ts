import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InternacionalRoutingModule } from './internacional.routing';
import { InternacionalComponent } from './componentes/internacional.component';

import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';

@NgModule({
  imports: [SharedModule, InternacionalRoutingModule, ResultadoCargaModule],
  declarations: [InternacionalComponent]
})
export class InternacionalModule { }
