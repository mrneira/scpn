import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TiposCausalesVinculacionRoutingModule } from './tiposCausalesVinculacion.routing';

import { TiposCausalesVinculacionComponent } from './componentes/tiposCausalesVinculacion.component';


@NgModule({
  imports: [SharedModule, TiposCausalesVinculacionRoutingModule ],
  declarations: [TiposCausalesVinculacionComponent]
})
export class TiposCausalesVinculacionModule { }
