import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AnulaRetencionesRoutingModule } from './anulaRetenciones.routing';

import { AnulaRetencionesComponent } from './componentes/anulaRetenciones.component';


@NgModule({
  imports: [SharedModule, AnulaRetencionesRoutingModule ],
  declarations: [AnulaRetencionesComponent]
})
export class AnulaRetencionesModule { }
