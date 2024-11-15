import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TipoVinculacionFamiliarRoutingModule } from './tipoVinculacionFamiliar.routing';

import { TipoVinculacionFamiliarComponent } from './componentes/tipoVinculacionFamiliar.component';


@NgModule({
  imports: [SharedModule, TipoVinculacionFamiliarRoutingModule ],
  declarations: [TipoVinculacionFamiliarComponent]
})
export class TipoVinculacionFamiliarModule { }
