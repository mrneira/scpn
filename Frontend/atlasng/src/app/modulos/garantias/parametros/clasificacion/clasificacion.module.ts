import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ClasificacionRoutingModule } from './clasificacion.routing';

import { ClasificacionComponent } from './componentes/clasificacion.component';


@NgModule({
  imports: [SharedModule, ClasificacionRoutingModule ],
  declarations: [ClasificacionComponent]
})
export class ClasificacionModule { }
