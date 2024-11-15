import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AsignacionCobranzasRoutingModule } from './asignacionCobranzas.routing';

import { AsignacionCobranzasComponent } from './componentes/asignacionCobranzas.component';
import { LovUsuariosModule } from '../../seguridad/lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, AsignacionCobranzasRoutingModule, LovUsuariosModule ],
  declarations: [AsignacionCobranzasComponent]
})
export class AsignacionCobranzasModule { }
