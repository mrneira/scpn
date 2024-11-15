import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ReasignacionCobranzasRoutingModule } from './reasignacionCobranzas.routing';

import { ReasignacionCobranzasComponent } from './componentes/reasignacionCobranzas.component';
import { LovUsuariosModule } from '../../seguridad/lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, ReasignacionCobranzasRoutingModule, LovUsuariosModule ],
  declarations: [ReasignacionCobranzasComponent]
})
export class ReasignacionCobranzasModule { }
