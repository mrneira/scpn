import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovGrupoOcupacionalRoutingModule } from './lov.grupoocupacional.routing';

import { LovGrupoOcupacionalComponent } from './componentes/lov.grupoocupacional.component';

@NgModule({
  imports: [SharedModule, LovGrupoOcupacionalRoutingModule],
  declarations: [LovGrupoOcupacionalComponent],
  exports: [LovGrupoOcupacionalComponent],
})
export class LovGrupoOcupacionalModule { }

